import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  MessageCircle,
} from "lucide-react";

const CATEGORIES = [
  { label: "Whey Protein", value: "Protein" },
  { label: "Mass Gainer", value: "MassGainer" },
  { label: "Pre-Workout", value: "PreWorkout" },
  { label: "BCAA & Aminos", value: "BCAA" },
  { label: "Creatine", value: "Creatine" },
  { label: "Multivitamin", value: "Multivitamin" },
  { label: "Fish Oil", value: "FishOil" },
  { label: "Accessories", value: "Accessories" },
];

const VALUE_PROPS = [
  {
    icon: ShieldCheck,
    title: "Verified authentic",
    body: "Every batch checked before it leaves the warehouse.",
  },
  {
    icon: Truck,
    title: "Pan-India delivery",
    body: "Weight-based fast shipping to every pincode.",
  },
  {
    icon: RotateCcw,
    title: "7-day returns",
    body: "No-questions money back if it's not right for you.",
  },
  {
    icon: MessageCircle,
    title: "Real support",
    body: "WhatsApp our team directly — no chatbot loops.",
  },
];

function formatINR(n) {
  return `\u20b9${n.toLocaleString("en-IN")}`;
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const railRef = useRef(null);
  const [bestsellers, setBestsellers] = useState([]);

  useEffect(() => {
    axiosInstance.get("/products", { params: { limit: 6 } })
      .then((response) => setBestsellers(response.data.products || []))
      .catch(() => setBestsellers([]));
  }, []);

  function scrollRail(direction) {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector("[data-card]");
    const step = (card ? card.offsetWidth : 260) + 16;
    rail.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Announcement bar */}
      <div className="bg-neutral-900 text-neutral-300 text-xs text-center py-2 px-4">
        For any query call or WhatsApp us:{" "}
        <span className="text-white font-semibold">+91 98968 65218</span>
        <span className="hidden sm:inline">
          {" "}
          &middot; Free shipping on prepaid orders above {formatINR(999)}
        </span>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-6">
          <Link to="/" className="text-xl font-extrabold tracking-tight text-neutral-900 shrink-0">
            Sarab<span className="text-blue-600">.</span>Fitness
          </Link>

          <div className="hidden lg:flex flex-1 items-center bg-neutral-100 border border-neutral-200 rounded-full pl-4 pr-1.5 py-1.5 max-w-md">
            <input
              type="text"
              placeholder="Search whey, creatine, pre-workout..."
              className="flex-1 bg-transparent outline-none text-sm text-neutral-900 placeholder-neutral-400"
            />
            <button
              type="button"
              aria-label="Search"
              className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center shrink-0"
            >
              <Search size={15} />
            </button>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-neutral-700">
            <a href="#categories" className="hover:text-blue-600 transition-colors">Categories</a>
            <a href="#bestsellers" className="hover:text-blue-600 transition-colors">Bestsellers</a>
            <a href="#why-us" className="hover:text-blue-600 transition-colors">Why us</a>
          </nav>

          <div className="hidden md:flex items-center gap-4 shrink-0">
            <Link to="/login" className="text-sm font-semibold text-neutral-700 hover:text-blue-600 transition-colors">
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold bg-neutral-900 hover:bg-neutral-800 text-white rounded-full px-5 py-2.5 transition-colors"
            >
              Sign up
            </Link>
            <button type="button" aria-label="Cart" className="relative text-neutral-900">
              <ShoppingCart size={21} />
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                3
              </span>
            </button>
          </div>

          <button
            type="button"
            aria-label="Menu"
            className="md:hidden ml-auto text-neutral-900"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-neutral-200 px-4 sm:px-6 py-4 flex flex-col gap-4 text-sm font-semibold text-neutral-700">
            <a href="#categories" onClick={() => setMenuOpen(false)}>Categories</a>
            <a href="#bestsellers" onClick={() => setMenuOpen(false)}>Bestsellers</a>
            <a href="#why-us" onClick={() => setMenuOpen(false)}>Why us</a>
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/register" onClick={() => setMenuOpen(false)} className="text-blue-600">
              Sign up
            </Link>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="bg-neutral-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24 grid lg:grid-cols-2 items-center gap-12">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-blue-400 mb-4">
              Sports nutrition, sourced clean
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[0.98] tracking-tight mb-6">
              Train hard.
              <br />
              Recover <span className="text-blue-500">harder.</span>
            </h1>
            <p className="text-neutral-400 text-base sm:text-lg leading-relaxed max-w-md mb-8">
              Genuine whey, mass gainers, pre-workouts and more &mdash; batch-checked
              for purity, shipped fast across India, and priced for the daily grind.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <a
                href="#bestsellers"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 py-3.5 text-sm transition-colors"
              >
                Shop bestsellers
                <ArrowRight size={16} />
              </a>
              <a
                href="#categories"
                className="inline-flex items-center gap-2 border border-neutral-600 hover:border-white text-white font-semibold rounded-full px-6 py-3.5 text-sm transition-colors"
              >
                Browse categories
              </a>
            </div>

            <div className="flex flex-wrap gap-6 border-t border-neutral-700 pt-6">
              <div className="flex items-center gap-2.5 text-xs text-neutral-400">
                <ShieldCheck size={18} className="text-blue-500 shrink-0" />
                <div>
                  <p className="text-white font-semibold text-sm">100% authentic</p>
                  verified batches
                </div>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-neutral-400">
                <Truck size={18} className="text-blue-500 shrink-0" />
                <div>
                  <p className="text-white font-semibold text-sm">Pan-India delivery</p>
                  fast shipping
                </div>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-neutral-400">
                <RotateCcw size={18} className="text-blue-500 shrink-0" />
                <div>
                  <p className="text-white font-semibold text-sm">7-day returns</p>
                  money back
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-72 sm:h-96 hidden lg:block" aria-hidden="true">
            <div className="absolute inset-0 m-auto w-96 h-96 rounded-full border border-dashed border-neutral-700" />
            <div className="absolute inset-8 m-auto w-80 h-80 rounded-full border border-neutral-700" />
            <div className="absolute inset-0 flex items-end justify-center gap-4 pb-4">
              <div className="w-24 h-52 rounded-t-2xl rounded-b-lg bg-linear-to-b from-blue-500 to-blue-900 shadow-2xl" />
              <div className="w-28 h-64 rounded-t-2xl rounded-b-lg bg-linear-to-b from-neutral-500 to-neutral-950 shadow-2xl" />
              <div className="w-20 h-40 rounded-t-2xl rounded-b-lg bg-linear-to-b from-amber-400 to-amber-700 shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="flex justify-between items-end gap-4 mb-8">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-blue-700 mb-2">
              Shop by category
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
              Find your stack
            </h2>
          </div>
          <Link
            to="/home"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-neutral-900 border-b-2 border-neutral-900 pb-0.5 shrink-0"
          >
            Shop all
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.label}
              to={`/home?category=${encodeURIComponent(cat.value)}`}
              className="group relative overflow-hidden rounded-3xl bg-neutral-900 hover:bg-blue-700 text-white p-6 min-h-37.5 flex flex-col justify-between transition-colors"
            >
              <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full border border-white/10" />
              <span className="font-mono text-xs text-neutral-400 group-hover:text-blue-200">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="font-bold text-lg leading-tight mb-2">{cat.label}</p>
                <span className="text-xs font-semibold text-neutral-400 group-hover:text-white inline-flex items-center gap-1">
                  Shop now <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section id="bestsellers" className="bg-neutral-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-end gap-4 mb-8">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-blue-700 mb-2">
                Shop the bestsellers
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
                Most reordered this month
              </h2>
            </div>
            <div className="hidden md:flex gap-2 shrink-0">
              <button
                type="button"
                aria-label="Scroll left"
                onClick={() => scrollRail(-1)}
                className="w-10 h-10 rounded-full border border-neutral-200 bg-white flex items-center justify-center hover:border-blue-600 hover:text-blue-600 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                aria-label="Scroll right"
                onClick={() => scrollRail(1)}
                className="w-10 h-10 rounded-full border border-neutral-200 bg-white flex items-center justify-center hover:border-blue-600 hover:text-blue-600 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div
            ref={railRef}
            className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none [&::-webkit-scrollbar]:hidden"
          >
            {bestsellers.length ? bestsellers.map((p) => {
              const title = p.pname;
              const category = p.category;
              const price = p.price;
              const image = p.image;
              return <Link
                key={p._id}
                data-card
                to={`/product/${p._id}`}
                className="snap-start shrink-0 w-64 bg-white border border-neutral-200 rounded-3xl p-4 hover:border-blue-600 transition-colors"
              >
                <div className="relative h-40 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4 overflow-hidden">
                  <img src={image} alt={title} className="w-full h-full object-cover" />
                </div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-blue-700 mb-1">
                  {category}
                </p>
                <p className="text-sm font-bold text-neutral-900 leading-snug min-h-10 mb-2">
                  {title}
                </p>
                <span className="inline-block text-[10px] font-mono bg-neutral-100 border border-neutral-200 text-neutral-600 px-2 py-1 rounded-md mb-3">
                  Verified product
                </span>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-lg font-extrabold text-neutral-900">{formatINR(price)}</span>
                </div>
                <span className="w-full block text-center bg-neutral-900 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl py-2.5 transition-colors">View product</span>
              </Link>;
            }) : <p className="text-sm text-neutral-500">No products are available yet.</p>}
          </div>
        </div>
      </section>

      {/* Value strip */}
      <section id="why-us" className="bg-neutral-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-bold tracking-widest uppercase text-blue-400 mb-6">
            Why Sarab Fitness
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-800 rounded-3xl overflow-hidden">
            {VALUE_PROPS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-neutral-900 p-6 flex flex-col gap-2.5">
                <Icon size={22} className="text-blue-500" />
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-xs text-neutral-400 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 pt-14 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-neutral-800">
          <div>
            <p className="text-lg font-extrabold text-white mb-3">
              Sarab<span className="text-blue-600">.</span>Fitness
            </p>
            <p className="text-sm leading-relaxed max-w-xs">
              Sports nutrition for the daily grind &mdash; genuine stock, honest
              pricing, and delivery that actually shows up on time.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-white mb-4">Shop</p>
            <ul className="space-y-2.5 text-sm">
              {CATEGORIES.slice(0, 5).map((c) => (
                <li key={c.label}>
                  <Link to={`/home?category=${encodeURIComponent(c.value)}`} className="hover:text-white transition-colors">{c.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-white mb-4">Company</p>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Track order</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-white mb-4">Policies</p>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Refund and return policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping policy</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 py-6 text-xs">
          <span>&copy; 2026 Sarab Fitness. All rights reserved.</span>
          <div className="flex gap-2 font-mono">
            {["UPI", "VISA", "MASTERCARD", "COD"].map((tag) => (
              <span key={tag} className="border border-neutral-700 rounded px-1.5 py-0.5">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
