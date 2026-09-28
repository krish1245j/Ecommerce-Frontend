import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    X,
    Mail,
    ShieldCheck,
    CalendarDays,
    LogOut,
    LayoutDashboard,
    ShoppingBag,
    Loader2,
    LogIn,
} from "lucide-react";
import axiosInstance from "../api/axiosInstance";

const formatMemberSince = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
    });
};

const UserInfoModal = ({ open, onClose, user, loading }) => {
    const navigate = useNavigate();

    // close on Escape
    useEffect(() => {
        if (!open) return;
        const handleKey = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [open, onClose]);

    if (!open) return null;

    const handleLogout = async () => {
        try {
            await axiosInstance.post("/auth/logout");
        } catch (err) {
            console.log(err.response?.data);
        } finally {
            localStorage.removeItem("accessToken");
            onClose();
            navigate("/login");
        }
    };

    const goTo = (path) => {
        onClose();
        navigate(path);
    };

    const initial = user?.username?.[0]?.toUpperCase() || "?";

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/50"
            onClick={onClose}
        >
            <div
                className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* HEADER */}
                <div className="bg-neutral-900 px-6 pt-6 pb-8 relative">
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold shrink-0">
                            {initial}
                        </div>
                        <div className="min-w-0">
                            <p className="text-white font-bold truncate">
                                {user?.username || "Guest"}
                            </p>
                            {user?.role === "admin" && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 mt-0.5">
                                    <ShieldCheck size={12} />
                                    Admin
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* BODY */}
                <div className="px-6 py-5">
                    {loading ? (
                        <div className="py-6 flex items-center justify-center text-neutral-400">
                            <Loader2 size={22} className="animate-spin" />
                        </div>
                    ) : !user ? (
                        <div className="py-4 flex flex-col items-center text-center gap-3">
                            <p className="text-sm text-neutral-500">
                                You're not logged in.
                            </p>
                            <button
                                onClick={() => goTo("/login")}
                                className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
                            >
                                <LogIn size={15} />
                                Log in
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail size={15} className="text-neutral-400 shrink-0" />
                                    <span className="text-neutral-700 truncate">{user.email}</span>
                                </div>

                                {user.createdAt && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <CalendarDays size={15} className="text-neutral-400 shrink-0" />
                                        <span className="text-neutral-700">
                                            Member since {formatMemberSince(user.createdAt)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="h-px bg-neutral-100 my-5" />

                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => goTo("/cart")}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors"
                                >
                                    <ShoppingBag size={16} />
                                    My cart
                                </button>

                                {user.role === "admin" && (
                                    <button
                                        onClick={() => goTo("/admin")}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
                                    >
                                        <LayoutDashboard size={16} />
                                        Admin panel
                                    </button>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserInfoModal;
