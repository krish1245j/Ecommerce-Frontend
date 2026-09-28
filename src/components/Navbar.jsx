
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import UserInfoModal from "./UserInfoModal";


import {
    Search,
    ShoppingCart,
    Package,
    X,
    Menu,
    UserRound,
} from "lucide-react";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [name,setName]=useState("")
    const [userInfo, setUserInfo] = useState(null);
    const [userInfoLoading, setUserInfoLoading] = useState(true);
    const [showUserInfo, setShowUserInfo] = useState(false);
    const navigate = useNavigate();
    const getName = async () => {
        try {
            const res = await axiosInstance.get("/auth/getMe");
            setName(res.data.user.username);
            setUserInfo(res.data.user);
        } catch (error) {
            console.log(error.response?.data);
            setUserInfo(null);
        } finally {
            setUserInfoLoading(false);
        }
    };
    useEffect(() => {
        getName();
    }, []);
    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-neutral-200">

            {/* ================= MAIN NAVBAR ================= */}
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-3">

                <div
                    className="
            flex items-center gap-3

            xl:grid
            xl:grid-cols-[190px_420px_1fr_auto]
            lg:xl:grid-cols-[480px_420px_1fr_auto]
            xl:gap-6
          "
                >

                    {/* ================= LOGO ================= */}
                    <Link
                        to="/"
                        className="
              shrink-0
              text-lg sm:text-xl
              font-extrabold
              tracking-tight
              text-neutral-900
              whitespace-nowrap
            "
                    >
                        Sarab<span className="text-blue-600">.</span>Fitness
                    </Link>


                    {/* ================= SEARCH ================= */}
                    <div
                        className="
              flex
              flex-1
              min-w-0
              items-center

              bg-neutral-100
              border border-neutral-200
              rounded-full

              pl-3 sm:pl-4
              pr-1.5
              py-1.5

              sm:max-w-105

              xl:w-130
              xl:max-w-none
              xl:flex-none
            "
                    >
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="
                flex-1
                min-w-0
                bg-transparent
                outline-none

                text-xs sm:text-sm
                text-neutral-900
                placeholder-neutral-400
              "
                        />

                        <button
                            type="button"
                            aria-label="Search"
                            className="
                w-8 h-8
                shrink-0
                rounded-full

                bg-neutral-900
                hover:bg-neutral-800
                text-white

                flex
                items-center
                justify-center

                transition-colors
              "
                        >
                            <Search size={15} />
                        </button>
                    </div>


                    {/* ================= DESKTOP NAV ================= */}
                    <nav
                        className="
              hidden xl:flex
              items-center
              justify-center
              gap-5 2xl:gap-7

              text-sm
              font-semibold
              text-neutral-700
            "
                    >
                        <a
                            href="#categories"
                            className="
                whitespace-nowrap
                hover:text-blue-600
                transition-colors
              "
                        >
                            Categories
                        </a>

                        <a
                            href="#bestsellers"
                            className="
                whitespace-nowrap
                hover:text-blue-600
                transition-colors
              "
                        >
                            Bestsellers
                        </a>

                        <a
                            href="#why-us"
                            className="
                whitespace-nowrap
                hover:text-blue-600
                transition-colors
              "
                        >
                            Why us
                        </a>
                    </nav>


                    {/* ================= DESKTOP RIGHT ================= */}
                    <div
                        className="
              hidden xl:flex
              items-center
              justify-end
              gap-3
              shrink-0
            "
                    >

                        {/* LOGIN */}
                        <Link
                            to="/login"
                            className="
                text-sm
                font-semibold
                text-neutral-700

                hover:text-blue-600
                transition-colors
              "
                        >
                            Login
                        </Link>


                        {/* SIGN UP */}
                        <Link
                            to="/register"
                            className="
                text-sm
                font-semibold

                bg-neutral-900
                hover:bg-neutral-800
                text-white

                rounded-full
                px-5
                py-2.5

                whitespace-nowrap
                transition-colors
              "
                        >
                            Sign up
                        </Link>


                        {/* CART */}
                        <button onClick={() => navigate("/orders")}
                            type="button"
                            aria-label="My orders"
                            title="My orders"
                            className="text-neutral-900 p-1.5 hover:text-blue-600 transition-colors"
                        >
                            <Package size={21} />
                        </button>

                        <button onClick={()=>navigate("/cart")}
                            type="button"
                            aria-label="Cart"
                            className="
                relative
                text-neutral-900
                p-1.5
                shrink-0

                hover:text-blue-600
                transition-colors
              "
                        >
                            <ShoppingCart size={22} />

                            <span
                                className="
                  absolute
                  -top-1
                  -right-1

                  bg-blue-600
                  text-white

                  text-[9px]
                  font-bold

                  w-4 h-4
                  rounded-full

                  flex
                  items-center
                  justify-center
                "
                            >
                                3
                            </span>
                        </button>


                        {/* USER INFORMATION */}
                        <button
                            type="button"
                            onClick={() => setShowUserInfo(true)}
                            className="
                flex
                items-center
                gap-2

                bg-neutral-900
                hover:bg-neutral-800
                text-white

                rounded-full
                px-4
                py-2.5

                text-sm
                font-semibold
                whitespace-nowrap

                transition-colors
              "
                        >
                            <UserRound size={17} />

                            <span className="hidden 2xl:inline">
                                {name || "Your information"} 
                            </span>

                            <span className="2xl:hidden">
                                Profile
                            </span>
                        </button>

                    </div>


                    {/* ================= MOBILE/TABLET CART ================= */}
                    <button
                        onClick={() => navigate("/orders")}
                        type="button"
                        aria-label="My orders"
                        className="xl:hidden shrink-0 text-neutral-900 p-1 hover:text-blue-600"
                    >
                        <Package size={20} />
                    </button>

                    <button
                    onClick={()=>navigate("/cart")}
                        type="button"
                        aria-label="Cart"
                        className="
              xl:hidden
              relative
              shrink-0
              text-neutral-900
              p-1
            "
                    >
                        <ShoppingCart size={21} />

                        <span
                            className="
                absolute
                -top-1.5
                -right-1.5

                bg-blue-600
                text-white

                text-[9px]
                font-bold

                w-4 h-4
                rounded-full

                flex
                items-center
                justify-center
              "
                        >
                            3
                        </span>
                    </button>


                    {/* ================= MOBILE/TABLET MENU ================= */}
                    <button
                        type="button"
                        aria-label="Menu"
                        className="
              xl:hidden
              shrink-0
              text-neutral-900
            "
                        onClick={() => setMenuOpen((prev) => !prev)}
                    >
                        {menuOpen ? (
                            <X size={24} />
                        ) : (
                            <Menu size={24} />
                        )}
                    </button>

                </div>
            </div>


            {/* ================= MOBILE/TABLET DROPDOWN ================= */}
            {menuOpen && (
                <div
                    className="
            xl:hidden

            border-t
            border-neutral-200

            bg-white

            px-4
            sm:px-6
            py-4
          "
                >
                    <nav className="flex flex-col gap-1">

                        <a
                            href="#categories"
                            onClick={() => setMenuOpen(false)}
                            className="
                px-3
                py-3

                rounded-lg

                text-sm
                font-semibold
                text-neutral-700

                hover:bg-neutral-100
                transition-colors
              "
                        >
                            Categories
                        </a>


                        <a
                            href="#bestsellers"
                            onClick={() => setMenuOpen(false)}
                            className="
                px-3
                py-3

                rounded-lg

                text-sm
                font-semibold
                text-neutral-700

                hover:bg-neutral-100
                transition-colors
              "
                        >
                            Bestsellers
                        </a>


                        <a
                            href="#why-us"
                            onClick={() => setMenuOpen(false)}
                            className="
                px-3
                py-3

                rounded-lg

                text-sm
                font-semibold
                text-neutral-700

                hover:bg-neutral-100
                transition-colors
              "
                        >
                            Why us
                        </a>


                        <div className="border-t border-neutral-200 my-2" />

                        <Link
                            to="/orders"
                            onClick={() => setMenuOpen(false)}
                            className="px-3 py-3 rounded-lg text-sm font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors"
                        >
                            My orders
                        </Link>


                        <Link
                            to="/login"
                            onClick={() => setMenuOpen(false)}
                            className="
                px-3
                py-3

                rounded-lg

                text-sm
                font-semibold
                text-neutral-700

                hover:bg-neutral-100
                transition-colors
              "
                        >
                            Login
                        </Link>


                        <Link
                            to="/register"
                            onClick={() => setMenuOpen(false)}
                            className="
                px-3
                py-3

                rounded-lg

                text-sm
                font-semibold
                text-neutral-700

                hover:bg-neutral-100
                transition-colors
              "
                        >
                            Sign up
                        </Link>


                        {/* MOBILE USER */}
                        <button
                            type="button"
                            onClick={() => {
                                setMenuOpen(false);
                                setShowUserInfo(true);
                            }}
                            className="
                mt-2
                w-full

                flex
                items-center
                gap-3

                bg-neutral-900
                hover:bg-neutral-800
                text-white

                rounded-xl

                px-4
                py-3

                text-sm
                font-semibold

                transition-colors
              "
                        >
                            <UserRound size={18} />
                            {name || "Your information"}
                        </button>

                    </nav>
                </div>
            )}

            <UserInfoModal
                open={showUserInfo}
                onClose={() => setShowUserInfo(false)}
                user={userInfo}
                loading={userInfoLoading}
            />

        </header>
    );
};

export default Navbar;
