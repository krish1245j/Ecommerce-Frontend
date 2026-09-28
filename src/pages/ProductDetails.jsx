import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getProduct } from "../api/productBuy";
import { addToCart } from "../api/cart";

import {
    Minus,
    Plus,
    ShoppingCart,
    Zap,
    Truck,
    ShieldCheck,
    RotateCcw,
    ChevronRight,
    Loader2,
    Check,
} from "lucide-react";

const ProductDetails = ({
    onBuyNow = () => {},
    isBuyingNow = false,
}) => {
    const navigate = useNavigate();
    const { productId } = useParams();

    const [status, setStatus] = useState("idle");
    // idle | loading | added | error

    const [errorMsg, setErrorMsg] = useState("");

    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState();

    const decrease = () => {
        setQuantity((q) => Math.max(1, q - 1));
    };

    const increase = () => {
        setQuantity((q) =>
            Math.min(product.stock || 1, q + 1)
        );
    };

    const handleAddToCart = async () => {
        if (status === "loading") return;

        setStatus("loading");
        setErrorMsg("");

        try {
            await addToCart(product._id, quantity);

            setStatus("added");

            setTimeout(() => {
                setStatus("idle");
            }, 1500);

        } catch (err) {
            if (err.response?.status === 401) {
                navigate("/login");
                return;
            }

            const message = err.response?.data?.message;

            setErrorMsg(message || "Couldn't add to cart");
            setStatus("error");

            setTimeout(() => {
                setStatus("idle");
            }, 2000);
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);

            try {
                const res = await getProduct(productId);

                setProduct(res.data.product);

            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    if (!product) {
        return <div>Loading...</div>;
    }

    const inStock = product.stock > 0;
    const lowStock = inStock && product.stock <= 5;

    return (
        <div className="min-h-screen flex flex-col bg-white">

            <Navbar />

            <main className="flex-1 w-[94%] max-w-350 mx-auto py-8 md:py-10">

                {/* ================= BREADCRUMB ================= */}

                <div className="
                    flex
                    items-center
                    gap-1.5
                    text-xs
                    sm:text-sm
                    text-neutral-400
                    mb-6
                    flex-wrap
                ">

                    <Link
                        to="/home"
                        className="hover:text-[#3B82F6] transition-colors"
                    >
                        Home
                    </Link>

                    <ChevronRight size={14} />

                    <span className="text-neutral-500">
                        {product.category}
                    </span>

                    <ChevronRight size={14} />

                    <span className="
                        text-neutral-700
                        font-medium
                        truncate
                        max-w-50
                    ">
                        {product.pname}
                    </span>

                </div>


                <div className="
                    grid
                    grid-cols-1
                    lg:grid-cols-2
                    gap-8
                    lg:gap-14
                ">

                    {/* ================= IMAGE ================= */}

                    <div className="
                        w-full
                        aspect-square
                        bg-[#F7F7F7]
                        border
                        border-[#E5E5E5]
                        rounded-lg
                        overflow-hidden
                    ">
                        <img
                            src={product.image}
                            alt={product.pname}
                            className="w-full h-full object-cover"
                        />
                    </div>


                    {/* ================= DETAILS ================= */}

                    <div className="flex flex-col">

                        <p className="
                            text-xs
                            font-semibold
                            uppercase
                            tracking-wider
                            text-[#3B82F6]
                            mb-2
                        ">
                            {product.category}
                        </p>


                        <h1 className="
                            text-2xl
                            sm:text-3xl
                            font-extrabold
                            text-[#171717]
                            tracking-tight
                            leading-tight
                        ">
                            {product.pname}
                        </h1>


                        <p className="
                            text-2xl
                            sm:text-3xl
                            font-extrabold
                            text-[#171717]
                            mt-4
                        ">
                            ₹{product.price?.toLocaleString("en-IN")}
                        </p>


                        {/* ================= STOCK ================= */}

                        <div className="mt-3">

                            {!inStock ? (

                                <span className="
                                    inline-block
                                    text-xs
                                    font-semibold
                                    text-red-600
                                    bg-red-50
                                    border
                                    border-red-100
                                    rounded-full
                                    px-3
                                    py-1
                                ">
                                    Out of stock
                                </span>

                            ) : lowStock ? (

                                <span className="
                                    inline-block
                                    text-xs
                                    font-semibold
                                    text-amber-600
                                    bg-amber-50
                                    border
                                    border-amber-100
                                    rounded-full
                                    px-3
                                    py-1
                                ">
                                    Only {product.stock} left in stock
                                </span>

                            ) : (

                                <span className="
                                    inline-block
                                    text-xs
                                    font-semibold
                                    text-green-600
                                    bg-green-50
                                    border
                                    border-green-100
                                    rounded-full
                                    px-3
                                    py-1
                                ">
                                    In stock
                                </span>

                            )}

                        </div>


                        {/* ================= DESCRIPTION ================= */}

                        <p className="
                            mt-5
                            text-sm
                            sm:text-[15px]
                            text-neutral-600
                            leading-relaxed
                        ">
                            {product.description}
                        </p>


                        <div className="
                            border-t
                            border-[#E5E5E5]
                            my-6
                        " />


                        {/* ================= QUANTITY ================= */}

                        <div className="
                            flex
                            flex-col
                            gap-4
                        ">

                            <div className="
                                flex
                                items-center
                                gap-4
                            ">

                                <span className="
                                    text-sm
                                    font-semibold
                                    text-neutral-700
                                ">
                                    Quantity
                                </span>


                                <div className="
                                    flex
                                    items-center
                                    border
                                    border-neutral-300
                                    rounded-md
                                    overflow-hidden
                                ">

                                    <button
                                        type="button"
                                        aria-label="Decrease quantity"
                                        onClick={decrease}
                                        disabled={
                                            !inStock ||
                                            quantity <= 1
                                        }
                                        className="
                                            w-9
                                            h-9
                                            flex
                                            items-center
                                            justify-center
                                            text-neutral-600
                                            hover:bg-[#F7F7F7]
                                            disabled:opacity-40
                                            disabled:cursor-not-allowed
                                            cursor-pointer
                                            transition-colors
                                        "
                                    >
                                        <Minus size={14} />
                                    </button>


                                    <span className="
                                        w-10
                                        text-center
                                        text-sm
                                        font-semibold
                                        text-[#171717]
                                    ">
                                        {quantity}
                                    </span>


                                    <button
                                        type="button"
                                        aria-label="Increase quantity"
                                        onClick={increase}
                                        disabled={
                                            !inStock ||
                                            quantity >= product.stock
                                        }
                                        className="
                                            w-9
                                            h-9
                                            flex
                                            items-center
                                            justify-center
                                            text-neutral-600
                                            hover:bg-[#F7F7F7]
                                            disabled:opacity-40
                                            disabled:cursor-not-allowed
                                            cursor-pointer
                                            transition-colors
                                        "
                                    >
                                        <Plus size={14} />
                                    </button>

                                </div>

                            </div>


                            {/* ================= ACTIONS ================= */}

                            <div className="
                                flex
                                flex-col
                                sm:flex-row
                                gap-3
                            ">

                                {/* ADD TO CART */}

                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    disabled={
                                        !inStock ||
                                        status === "loading"
                                    }
                                    className={`
                                        flex-1
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        py-3.5
                                        rounded-md
                                        border-2
                                        text-sm
                                        font-semibold
                                        transition-colors
                                        duration-200
                                        cursor-pointer
                                        disabled:opacity-40
                                        disabled:cursor-not-allowed

                                        ${
                                            status === "added"
                                                ? "border-green-600 bg-green-600 text-white"
                                                : status === "error"
                                                ? "border-red-500 text-red-500"
                                                : "border-[#171717] text-[#171717] hover:bg-[#171717] hover:text-white"
                                        }
                                    `}
                                >

                                    {status === "loading" ? (

                                        <>
                                            <Loader2
                                                size={16}
                                                className="animate-spin"
                                            />
                                            Adding...
                                        </>

                                    ) : status === "added" ? (

                                        <>
                                            <Check size={16} />
                                            Added
                                        </>

                                    ) : status === "error" ? (

                                        "Try Again"

                                    ) : (

                                        <>
                                            <ShoppingCart size={16} />
                                            Add to Cart
                                        </>

                                    )}

                                </button>


                                {/* BUY NOW */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        onBuyNow(
                                            product,
                                            quantity
                                        )
                                    }
                                    disabled={
                                        !inStock ||
                                        isBuyingNow
                                    }
                                    className="
                                        flex-1
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        py-3.5
                                        rounded-md
                                        bg-[#171717]
                                        hover:bg-[#3B82F6]
                                        text-white
                                        text-sm
                                        font-semibold
                                        transition-colors
                                        duration-200
                                        cursor-pointer
                                        disabled:opacity-40
                                        disabled:cursor-not-allowed
                                    "
                                >

                                    {isBuyingNow ? (

                                        <Loader2
                                            size={16}
                                            className="animate-spin"
                                        />

                                    ) : (

                                        <Zap size={16} />

                                    )}

                                    Buy Now

                                </button>

                            </div>

                        </div>


                        {/* ================= ERROR ================= */}

                        {status === "error" && (

                            <p className="
                                mt-2
                                text-xs
                                text-red-500
                            ">
                                {errorMsg}
                            </p>

                        )}


                        <div className="
                            border-t
                            border-[#E5E5E5]
                            my-6
                        " />


                        {/* ================= TRUST STRIP ================= */}

                        <div className="
                            grid
                            grid-cols-1
                            sm:grid-cols-3
                            gap-4
                        ">

                            <div className="
                                flex
                                items-center
                                gap-2.5
                            ">
                                <Truck
                                    size={18}
                                    className="text-[#3B82F6] shrink-0"
                                />

                                <p className="
                                    text-xs
                                    text-neutral-600
                                    leading-snug
                                ">
                                    Free shipping over ₹2,000
                                </p>
                            </div>


                            <div className="
                                flex
                                items-center
                                gap-2.5
                            ">
                                <ShieldCheck
                                    size={18}
                                    className="text-[#3B82F6] shrink-0"
                                />

                                <p className="
                                    text-xs
                                    text-neutral-600
                                    leading-snug
                                ">
                                    Secure checkout
                                </p>
                            </div>


                            <div className="
                                flex
                                items-center
                                gap-2.5
                            ">
                                <RotateCcw
                                    size={18}
                                    className="text-[#3B82F6] shrink-0"
                                />

                                <p className="
                                    text-xs
                                    text-neutral-600
                                    leading-snug
                                ">
                                    7-day easy returns
                                </p>
                            </div>

                        </div>


                        <div className="
                            border-t
                            border-[#E5E5E5]
                            my-6
                        " />


                        {/* ================= PRODUCT DETAILS ================= */}

                        <div>

                            <h2 className="
                                text-sm
                                font-bold
                                text-[#171717]
                                mb-3
                            ">
                                Product Details
                            </h2>


                            <dl className="text-sm">

                                <div className="
                                    flex
                                    justify-between
                                    py-2.5
                                    border-b
                                    border-neutral-100
                                ">
                                    <dt className="text-neutral-500">
                                        Category
                                    </dt>

                                    <dd className="
                                        font-medium
                                        text-neutral-800
                                    ">
                                        {product.category}
                                    </dd>
                                </div>


                                <div className="
                                    flex
                                    justify-between
                                    py-2.5
                                    border-b
                                    border-neutral-100
                                ">
                                    <dt className="text-neutral-500">
                                        Availability
                                    </dt>

                                    <dd className="
                                        font-medium
                                        text-neutral-800
                                    ">
                                        {inStock
                                            ? `${product.stock} units`
                                            : "Out of stock"}
                                    </dd>
                                </div>


                                <div className="
                                    flex
                                    justify-between
                                    py-2.5
                                ">
                                    <dt className="text-neutral-500">
                                        Product ID
                                    </dt>

                                    <dd className="
                                        font-medium
                                        text-neutral-800
                                        truncate
                                        max-w-40
                                    ">
                                        {product._id}
                                    </dd>
                                </div>

                            </dl>

                        </div>

                    </div>

                </div>

            </main>


            {/* ================= FOOTER ================= */}

            <footer className="
                bg-neutral-900
                text-neutral-400
                pt-12
                px-6
                mt-16
            ">

                <div className="
                    max-w-7xl
                    mx-auto
                    flex
                    flex-col
                    sm:flex-row
                    justify-between
                    items-center
                    gap-4
                    py-7
                    text-xs
                    border-t
                    border-neutral-800
                ">

                    <span>
                        © 2026 Sarab Fitness. All rights reserved.
                    </span>


                    <div className="
                        flex
                        gap-2
                        font-mono
                    ">

                        {["UPI", "VISA", "MASTERCARD", "COD"].map(
                            (tag) => (
                                <span
                                    key={tag}
                                    className="
                                        border
                                        border-neutral-700
                                        rounded
                                        px-2
                                        py-1
                                    "
                                >
                                    {tag}
                                </span>
                            )
                        )}

                    </div>

                </div>

            </footer>

        </div>
    );
};

export default ProductDetails;