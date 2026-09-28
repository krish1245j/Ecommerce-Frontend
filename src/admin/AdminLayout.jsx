import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import axiosInstance from "../api/axiosInstance";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
];

const linkClasses = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
    isActive
      ? "bg-blue-600 text-white"
      : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
  }`;

const AdminLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (err) {
      console.log(err.response?.data);
    } finally {
      localStorage.removeItem("accessToken");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#f7f7f7]">

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 bg-neutral-900 text-white min-h-screen sticky top-0">
        <div className="px-6 py-6 border-b border-neutral-800">
          <p className="text-lg font-extrabold tracking-tight">
            Sarab<span className="text-blue-500">.</span>Fitness
          </p>
          <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-blue-500" />
            Admin panel
          </p>
        </div>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClasses}>
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-6 border-t border-neutral-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MOBILE TOP BAR ================= */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-neutral-900 text-white flex items-center justify-between px-4 py-3">
        <p className="text-base font-extrabold tracking-tight">
          Sarab<span className="text-blue-500">.</span>Fitness
          <span className="text-neutral-400 font-medium text-xs ml-2">Admin</span>
        </p>
        <button onClick={() => setMenuOpen((prev) => !prev)} aria-label="Menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden fixed top-[52px] inset-x-0 z-40 bg-neutral-900 text-white px-4 py-4 border-t border-neutral-800">
          <nav className="flex flex-col gap-1.5">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMenuOpen(false)}
                className={linkClasses}
              >
                <Icon size={17} />
                {label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="mt-2 w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <LogOut size={17} />
              Logout
            </button>
          </nav>
        </div>
      )}

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 min-w-0 pt-16 lg:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
