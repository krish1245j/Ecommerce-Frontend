import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, CreditCard, Loader2, Lock, MapPin, ShoppingBag } from "lucide-react";
import Navbar from "../components/Navbar";
import { getCart } from "../api/cart";
import axiosInstance from "../api/axiosInstance";
import { createRazorpayOrder, verifyRazorpayPayment } from "../api/payment";
import { loadRazorpayScript } from "../utils/loadRazorpay";

const initialAddress = { fullName: "", phone: "", address: "", city: "", state: "", pincode: "", paymentMethod: "COD" };
const formatMoney = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

export default function Checkout() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [form, setForm] = useState(initialAddress);
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    getCart().then(({ data }) => {
      const cartItems = data.cart?.items || [];
      setItems(cartItems); setSubTotal(data.subTotal || 0);
      setState(cartItems.length ? "ready" : "empty");
    }).catch((err) => {
      setState(err.response?.status === 401 ? "unauthenticated" : "error");
    });
  }, []);

  const itemCount = useMemo(() => items.reduce((count, item) => count + item.quantity, 0), [items]);
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  async function placeOrder(event) {
    event.preventDefault();
    setError("");
    if (!/^\d{10}$/.test(form.phone)) return setError("Enter a valid 10-digit phone number.");
    if (!/^\d{6}$/.test(form.pincode)) return setError("Enter a valid 6-digit pincode.");

    if (form.paymentMethod === "COD") {
      setPlacing(true);
      try {
        await axiosInstance.post("/transaction/orders", form);
        setState("success");
      } catch (err) {
        setError(err.response?.data?.message || "We could not place your order. Please try again.");
      } finally {
        setPlacing(false);
      }
      return;
    }

    // ---- ONLINE (Razorpay) ----
    setPlacing(true);
    try {
      const { fullName, phone, address, city, state: addressState, pincode } = form;
      const shippingAddress = { fullName, phone, address, city, state: addressState, pincode };

      const { data } = await createRazorpayOrder(shippingAddress);
      const { razorpayOrder, key } = data;

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !key) {
        setError("Couldn't load the payment gateway. Please check your connection and try again.");
        setPlacing(false);
        return;
      }

      const rzp = new window.Razorpay({
        key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        order_id: razorpayOrder.id,
        name: "Sarab.Fitness",
        description: `Order for ${itemCount} item${itemCount !== 1 ? "s" : ""}`,
        prefill: { name: fullName, contact: phone },
        theme: { color: "#171717" },
        handler: async (response) => {
          try {
            await verifyRazorpayPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              ...shippingAddress,
            });
            setState("success");
          } catch (err) {
            setError(err.response?.data?.message || "Payment verification failed. If money was deducted, it will be refunded shortly.");
          } finally {
            setPlacing(false);
          }
        },
        modal: {
          // fires when the user closes the Razorpay popup without paying
          ondismiss: () => setPlacing(false),
        },
      });

      rzp.on("payment.failed", () => {
        setError("Payment failed. Please try again.");
        setPlacing(false);
      });

      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || "We could not start the payment. Please try again.");
      setPlacing(false);
    }
  }

  return <div className="min-h-screen bg-[#f7f7f7]"><Navbar />
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-[#3B82F6]"><ArrowLeft size={16}/> Back to cart</Link>
      {state === "loading" && <div className="py-28 text-center text-neutral-500"><Loader2 className="animate-spin mx-auto mb-3"/>Loading checkout…</div>}
      {state === "unauthenticated" && <EmptyState icon={<Lock size={26}/>} title="Log in to checkout" body="Your cart and checkout are secured with your account." action="Log in" onClick={() => navigate("/login")}/>}
      {state === "empty" && <EmptyState icon={<ShoppingBag size={26}/>} title="Your cart is empty" body="Add products before continuing to checkout." action="Browse products" onClick={() => navigate("/home")}/>}
      {state === "error" && <EmptyState icon={<ShoppingBag size={26}/>} title="Checkout is unavailable" body="We could not load your cart. Please return and try again." action="Return to cart" onClick={() => navigate("/cart")}/>}
      {state === "success" && <div className="max-w-lg mx-auto mt-16 bg-white border border-neutral-200 rounded-xl p-8 text-center"><CheckCircle2 size={48} className="mx-auto mb-4 text-green-600"/><h1 className="text-2xl font-extrabold text-neutral-900">Order placed successfully</h1><p className="mt-3 text-sm leading-relaxed text-neutral-500">Your order is confirmed and your cart has been cleared. We’ll use the shipping details you provided.</p><button onClick={() => navigate("/home")} className="mt-7 bg-[#171717] hover:bg-[#3B82F6] text-white font-semibold text-sm rounded-md px-6 py-3">Continue shopping</button></div>}
      {state === "ready" && <><div className="mt-7 mb-8"><p className="text-xs font-bold uppercase tracking-wider text-[#3B82F6]">Secure checkout</p><h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">Delivery details</h1><p className="mt-2 text-sm text-neutral-500">Review your order and tell us where to deliver it.</p></div>
        <div className="grid lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-start"><form onSubmit={placeOrder} className="bg-white border border-neutral-200 rounded-xl p-5 sm:p-7"><div className="flex gap-3 items-center mb-6"><span className="w-9 h-9 rounded-full bg-blue-50 text-[#3B82F6] grid place-items-center"><MapPin size={19}/></span><div><h2 className="font-extrabold text-neutral-900">Shipping address</h2><p className="text-xs text-neutral-500">All fields are required.</p></div></div><div className="grid sm:grid-cols-2 gap-4"><Field label="Full name" name="fullName" value={form.fullName} onChange={update} /><Field label="Phone number" name="phone" value={form.phone} onChange={update} inputMode="numeric" /><div className="sm:col-span-2"><Field label="Address" name="address" value={form.address} onChange={update} /></div><Field label="City" name="city" value={form.city} onChange={update} /><Field label="State" name="state" value={form.state} onChange={update} /><Field label="Pincode" name="pincode" value={form.pincode} onChange={update} inputMode="numeric" /></div><div className="mt-7 pt-6 border-t border-neutral-100"><div className="flex gap-3 items-center mb-4"><span className="w-9 h-9 rounded-full bg-blue-50 text-[#3B82F6] grid place-items-center"><CreditCard size={18}/></span><h2 className="font-extrabold text-neutral-900">Payment method</h2></div><div className="grid sm:grid-cols-2 gap-3"><Payment value="COD" label="Cash on delivery" checked={form.paymentMethod === "COD"} onChange={update}/><Payment value="ONLINE" label="Pay online" checked={form.paymentMethod === "ONLINE"} onChange={update}/></div></div>{error && <p className="mt-5 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}<button disabled={placing} className="w-full mt-7 py-3.5 rounded-md bg-[#171717] hover:bg-[#3B82F6] text-white text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2">{placing && <Loader2 size={17} className="animate-spin"/>}{placing ? (form.paymentMethod === "ONLINE" ? "Waiting for payment…" : "Placing order…") : form.paymentMethod === "ONLINE" ? `Pay securely · ${formatMoney(subTotal)}` : `Place order · ${formatMoney(subTotal)}`}</button></form>
          <aside className="bg-white border border-neutral-200 rounded-xl p-5 sm:p-6 lg:sticky lg:top-24"><h2 className="font-extrabold text-neutral-900">Order summary</h2><p className="mt-1 text-sm text-neutral-500">{itemCount} item{itemCount !== 1 ? "s" : ""}</p><div className="my-5 border-y border-neutral-100 divide-y divide-neutral-100">{items.map((item) => <div key={item._id} className="py-3 flex gap-3"><img src={item.product.image} alt="" className="w-12 h-12 rounded-md object-cover bg-neutral-100"/><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-neutral-800 line-clamp-2">{item.product.pname}</p><p className="mt-1 text-xs text-neutral-500">Qty {item.quantity}</p></div><strong className="text-sm text-neutral-900 whitespace-nowrap">{formatMoney(item.product.price * item.quantity)}</strong></div>)}</div><div className="flex justify-between text-sm text-neutral-600"><span>Subtotal</span><span>{formatMoney(subTotal)}</span></div><div className="flex justify-between text-sm text-neutral-600 mt-3"><span>Delivery</span><span className="font-medium text-green-600">Calculated at checkout</span></div><div className="flex justify-between pt-4 mt-4 border-t border-neutral-200"><span className="font-extrabold text-neutral-900">Order total</span><span className="font-extrabold text-neutral-900 text-lg">{formatMoney(subTotal)}</span></div><div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-neutral-400"><Lock size={12}/>Secure checkout</div></aside></div></>}
    </main></div>;
}

function Field({ label, name, value, onChange, inputMode }) { return <label className="block text-sm font-semibold text-neutral-700">{label}<input required name={name} value={value} onChange={onChange} inputMode={inputMode} className="mt-2 w-full rounded-md border border-neutral-300 px-3.5 py-3 text-sm text-neutral-900 outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-100"/></label> }
function Payment({ value, label, checked, onChange }) { return <label className={`flex items-center gap-3 border rounded-md p-3.5 cursor-pointer ${checked ? "border-[#3B82F6] bg-blue-50" : "border-neutral-200"}`}><input type="radio" name="paymentMethod" value={value} checked={checked} onChange={onChange}/><span className="text-sm font-semibold text-neutral-800">{label}</span></label> }
function EmptyState({ icon, title, body, action, onClick }) { return <div className="max-w-lg mx-auto mt-16 bg-white border border-neutral-200 rounded-xl p-8 text-center"><div className="w-14 h-14 mx-auto mb-5 rounded-full bg-neutral-100 text-neutral-500 grid place-items-center">{icon}</div><h1 className="text-xl font-extrabold text-neutral-900">{title}</h1><p className="mt-2 text-sm text-neutral-500">{body}</p><button onClick={onClick} className="mt-6 bg-[#171717] hover:bg-[#3B82F6] text-white font-semibold text-sm rounded-md px-5 py-3">{action}</button></div> }
