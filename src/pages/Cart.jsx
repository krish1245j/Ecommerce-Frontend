import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getCart, updateCartItem, removeCartItem } from "../api/cart";
import {
    Minus,
    Plus,
    Trash2,
    ArrowLeft,
    ShoppingBag,
    Tag,
    Lock,
    Truck,
    Loader2,
    LogIn,
} from "lucide-react";

const FREE_SHIPPING_THRESHOLD = 2000;
const SHIPPING_FEE = 99;

const Cart = () => {
    const navigate = useNavigate();

    // "loading" | "loaded" | "empty" | "unauthenticated" | "error"
    const [pageState, setPageState] = useState("loading");
    const [items, setItems] = useState([]); // cart.items from the API, each: { _id, product: {_id, pname, price, image, stock}, quantity }
    const [subTotal, setSubTotal] = useState(0);

    const [pendingId, setPendingId] = useState(null); // productId currently being updated/removed
    const [itemErrors, setItemErrors] = useState({}); // { [productId]: "message" }

    const [promoCode, setPromoCode] = useState("");
    const [appliedPromo, setAppliedPromo] = useState(null);
    const [promoError, setPromoError] = useState("");

    const fetchCart = async () => {
        try {
            const res = await getCart();
            const cartItems = res.data.cart.items || [];
            setItems(cartItems);
            setSubTotal(res.data.subTotal ?? 0);
            setPageState(cartItems.length === 0 ? "empty" : "loaded");
        } catch (err) {
            const status = err.response?.status;

            if (status === 401) {
                setPageState("unauthenticated");
            } else if (status === 404) {
                // "Cart does not exists" -> user just hasn't added anything yet
                setItems([]);
                setSubTotal(0);
                setPageState("empty");
            } else {
                setPageState("error");
            }
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const setItemError = (productId, message) => {
        setItemErrors((prev) => ({ ...prev, [productId]: message }));
        if (message) {
            setTimeout(() => {
                setItemErrors((prev) => {
                    const next = { ...prev };
                    delete next[productId];
                    return next;
                });
            }, 2500);
        }
    };

    const handleQuantityChange = async (item, delta) => {
        const productId = item.product._id;
        const newQuantity = item.quantity + delta;

        if (newQuantity < 1 || newQuantity > item.product.stock || pendingId) return;

        setPendingId(productId);
        try {
            const res = await updateCartItem(productId, newQuantity);
            setItems(res.data.cart.items || []);
            setSubTotal(res.data.subTotal ?? 0);
        } catch (err) {
            setItemError(productId, err.response?.data?.message || "Couldn't update quantity");
        } finally {
            setPendingId(null);
        }
    };

    const handleRemove = async (item) => {
        const productId = item.product._id;
        if (pendingId) return;

        setPendingId(productId);
        try {
            const res = await removeCartItem(productId);
            const remaining = res.data.cart.items || [];
            setItems(remaining);
            setSubTotal(res.data.subTotal ?? 0);
            if (remaining.length === 0) setPageState("empty");
        } catch (err) {
            setItemError(productId, err.response?.data?.message || "Couldn't remove item");
        } finally {
            setPendingId(null);
        }
    };

    const discount = appliedPromo ? Math.round(subTotal * appliedPromo.percent) : 0;
    const shipping = subTotal === 0 || subTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const total = subTotal - discount + shipping;
    const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - subTotal;

    const itemCount = useMemo(
        () => items.reduce((sum, item) => sum + item.quantity, 0),
        [items]
    );

    const handleApplyPromo = (e) => {
        e.preventDefault();
        const code = promoCode.trim().toUpperCase();
        if (!code) return;

        if (code === "SARAB10") {
            setAppliedPromo({ code, percent: 0.1 });
            setPromoError("");
        } else {
            setAppliedPromo(null);
            setPromoError("That code isn't valid.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <main className="flex-1 w-[94%] max-w-350 mx-auto py-8 md:py-10 ">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#3B82F6] mb-2">
                    Your Cart
                </p>

                <div className="flex items-end justify-between flex-wrap gap-3 mb-8">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-[#171717] tracking-tight">
                        Shopping Cart
                        {pageState === "loaded" && (
                            <span className="text-neutral-400 font-semibold">
                                {" "}({itemCount} {itemCount === 1 ? "item" : "items"})
                            </span>
                        )}
                    </h1>

                    {pageState !== "unauthenticated" && (
                        <Link
                            to="/home"
                            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-neutral-600 hover:text-[#3B82F6] transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Continue shopping
                        </Link>
                    )}
                </div>

                {/* ================= LOADING ================= */}
                {pageState === "loading" && (
                    <div className="flex flex-col items-center justify-center py-24 text-neutral-400">
                        <Loader2 size={26} className="animate-spin mb-3" />
                        <p className="text-sm">Loading your cart...</p>
                    </div>
                )}

                {/* ================= NOT LOGGED IN ================= */}
                {pageState === "unauthenticated" && (
                    <div className="flex flex-col items-center justify-center text-center border border-[#E5E5E5] rounded-lg py-20 px-6">
                        <div className="w-16 h-16 rounded-full bg-[#F7F7F7] flex items-center justify-center mb-5">
                            <LogIn size={24} className="text-neutral-400" />
                        </div>
                        <h2 className="text-lg font-bold text-[#171717] mb-2">
                            Log in to see your cart
                        </h2>
                        <p className="text-sm text-neutral-500 max-w-xs mb-6">
                            Your cart is tied to your account, so sign in to view or add items.
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="px-6 py-3 rounded-md bg-[#171717] hover:bg-[#3B82F6] text-white text-sm font-semibold transition-colors duration-200 cursor-pointer"
                        >
                            Log in
                        </button>
                    </div>
                )}

                {/* ================= ERROR ================= */}
                {pageState === "error" && (
                    <div className="flex flex-col items-center justify-center text-center border border-[#E5E5E5] rounded-lg py-20 px-6">
                        <h2 className="text-lg font-bold text-[#171717] mb-2">
                            Couldn't load your cart
                        </h2>
                        <p className="text-sm text-neutral-500 max-w-xs mb-6">
                            Something went wrong on our end. Please try again.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setPageState("loading");
                                fetchCart();
                            }}
                            className="px-6 py-3 rounded-md bg-[#171717] hover:bg-[#3B82F6] text-white text-sm font-semibold transition-colors duration-200 cursor-pointer"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* ================= EMPTY ================= */}
                {pageState === "empty" && (
                    <div className="flex flex-col items-center justify-center text-center border border-[#E5E5E5] rounded-lg py-20 px-6">
                        <div className="w-16 h-16 rounded-full bg-[#F7F7F7] flex items-center justify-center mb-5">
                            <ShoppingBag size={26} className="text-neutral-400" />
                        </div>
                        <h2 className="text-lg font-bold text-[#171717] mb-2">
                            Your cart is empty
                        </h2>
                        <p className="text-sm text-neutral-500 max-w-xs mb-6">
                            Looks like you haven't added anything yet. Explore our
                            products and find something you'll love.
                        </p>
                        <Link
                            to="/home"
                            className="px-6 py-3 rounded-md bg-[#171717] hover:bg-[#3B82F6] text-white text-sm font-semibold transition-colors duration-200"
                        >
                            Browse products
                        </Link>
                    </div>
                )}

                {/* ================= LOADED ================= */}
                {pageState === "loaded" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
                        {/* ================= CART ITEMS ================= */}
                        <div className="lg:col-span-2 flex flex-col gap-4">
                            {items.map((item) => {
                                const productId = item.product._id;
                                const isPending = pendingId === productId;
                                const itemError = itemErrors[productId];

                                return (
                                    <div
                                        key={item._id}
                                        className="flex gap-4 sm:gap-5 border border-[#E5E5E5] rounded-lg p-3 sm:p-4 bg-white hover:border-neutral-300 transition-colors"
                                    >
                                        {/* IMAGE */}
                                        <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-[#F7F7F7] border border-[#E5E5E5] rounded-md overflow-hidden">
                                            <img
                                                src={item.product.image}
                                                alt={item.product.pname}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* INFO */}
                                        <div className="flex-1 min-w-0 flex flex-col">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="text-sm sm:text-base font-medium text-neutral-800 leading-5 line-clamp-2">
                                                        {item.product.pname}
                                                    </p>
                                                    {item.product.stock <= 5 && (
                                                        <p className="text-[11px] font-semibold text-amber-600 mt-1">
                                                            Only {item.product.stock} left in stock
                                                        </p>
                                                    )}
                                                </div>

                                                <button
                                                    type="button"
                                                    aria-label="Remove item"
                                                    onClick={() => handleRemove(item)}
                                                    disabled={isPending}
                                                    className="shrink-0 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer p-1 disabled:opacity-40 disabled:cursor-not-allowed"
                                                >
                                                    {isPending ? (
                                                        <Loader2 size={17} className="animate-spin" />
                                                    ) : (
                                                        <Trash2 size={17} />
                                                    )}
                                                </button>
                                            </div>

                                            <div className="mt-auto flex items-end justify-between flex-wrap gap-3 pt-3">
                                                {/* QUANTITY STEPPER */}
                                                <div>
                                                    <div className="flex items-center border border-neutral-300 rounded-md overflow-hidden">
                                                        <button
                                                            type="button"
                                                            aria-label="Decrease quantity"
                                                            onClick={() => handleQuantityChange(item, -1)}
                                                            disabled={item.quantity <= 1 || isPending}
                                                            className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:bg-[#F7F7F7] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="w-9 text-center text-sm font-semibold text-[#171717]">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            aria-label="Increase quantity"
                                                            onClick={() => handleQuantityChange(item, 1)}
                                                            disabled={item.quantity >= item.product.stock || isPending}
                                                            className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:bg-[#F7F7F7] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                    {itemError && (
                                                        <p className="text-[11px] text-red-500 mt-1.5">
                                                            {itemError}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* PRICE */}
                                                <div className="text-right">
                                                    <p className="text-sm sm:text-base font-bold text-[#171717]">
                                                        ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                                                    </p>
                                                    {item.quantity > 1 && (
                                                        <p className="text-xs text-neutral-400">
                                                            ₹{item.product.price.toLocaleString("en-IN")} each
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            <Link
                                to="/home"
                                className="sm:hidden flex items-center justify-center gap-1.5 text-sm font-semibold text-neutral-600 hover:text-[#3B82F6] transition-colors mt-1 py-2"
                            >
                                <ArrowLeft size={16} />
                                Continue shopping
                            </Link>
                        </div>

                        {/* ================= ORDER SUMMARY ================= */}
                        <div className="lg:sticky lg:top-24 border border-[#E5E5E5] rounded-lg p-5 sm:p-6 bg-white">
                            <h2 className="text-lg font-extrabold text-[#171717] mb-5">
                                Order Summary
                            </h2>

                            {shipping > 0 && (
                                <div className="flex items-start gap-2.5 bg-[#F7F7F7] rounded-md px-3.5 py-3 mb-5">
                                    <Truck size={16} className="text-[#3B82F6] mt-0.5 shrink-0" />
                                    <p className="text-xs text-neutral-600 leading-relaxed">
                                        Add{" "}
                                        <span className="font-semibold text-[#171717]">
                                            ₹{amountToFreeShipping.toLocaleString("en-IN")}
                                        </span>{" "}
                                        more to get free shipping.
                                    </p>
                                </div>
                            )}

                            <form onSubmit={handleApplyPromo} className="mb-5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-2">
                                    Promo code
                                </label>
                                <div className="flex gap-2">
                                    <div className="flex-1 flex items-center gap-2 bg-[#F7F7F7] border border-neutral-200 rounded-md px-3">
                                        <Tag size={14} className="text-neutral-400 shrink-0" />
                                        <input
                                            type="text"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                            placeholder="Enter code"
                                            className="w-full min-w-0 bg-transparent outline-none py-2.5 text-sm text-neutral-900 placeholder-neutral-400"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="px-4 rounded-md bg-[#171717] hover:bg-[#3B82F6] text-white text-sm font-semibold transition-colors duration-200 cursor-pointer shrink-0"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {promoError && (
                                    <p className="text-xs text-red-500 mt-2">{promoError}</p>
                                )}
                                {appliedPromo && (
                                    <p className="text-xs text-green-600 font-medium mt-2">
                                        "{appliedPromo.code}" applied — {appliedPromo.percent * 100}% off
                                    </p>
                                )}
                            </form>

                            <div className="flex flex-col gap-3 pt-4 border-t border-neutral-100 text-sm">
                                <div className="flex justify-between text-neutral-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-neutral-800">
                                        ₹{subTotal.toLocaleString("en-IN")}
                                    </span>
                                </div>

                                {appliedPromo && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span className="font-medium">
                                            −₹{discount.toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between text-neutral-600">
                                    <span>Shipping</span>
                                    <span className="font-medium text-neutral-800">
                                        {shipping === 0 ? "Free" : `₹${shipping}`}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 mt-4 border-t border-neutral-200">
                                <span className="text-base font-extrabold text-[#171717]">
                                    Total
                                </span>
                                <span className="text-xl font-extrabold text-[#171717]">
                                    ₹{total.toLocaleString("en-IN")}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => navigate("/checkout")}
                                className="w-full mt-6 py-3.5 rounded-md bg-[#171717] hover:bg-[#3B82F6] text-white text-sm font-semibold transition-colors duration-200 cursor-pointer"
                            >
                                Proceed to Checkout
                            </button>

                            <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-neutral-400">
                                <Lock size={12} />
                                Secure checkout
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <footer className="bg-neutral-900 text-neutral-400 pt-12 px-6 mt-16">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 py-7 text-xs border-t border-neutral-800">
                    <span>© 2026 Sarab Fitness. All rights reserved.</span>
                    <div className="flex gap-2 font-mono">
                        {["UPI", "VISA", "MASTERCARD", "COD"].map((tag) => (
                            <span
                                key={tag}
                                className="border border-neutral-700 rounded px-2 py-1"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Cart;
