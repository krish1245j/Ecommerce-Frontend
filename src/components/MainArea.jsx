import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import ProductCard from "./ProductCard";

const MainArea = ({ selectedCategory = "" }) => {
    const [products, setProducts] = useState([]);
    const [filterOpen, setFilterOpen] = useState(false);
    const [sort, setSort] = useState("");

    const [filters, setFilters] = useState({
        category: selectedCategory,
        minPrice: "",
        maxPrice: "",
        sort: ""
    });

    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(5999);
    const [activeCategory, setActiveCategory] = useState(selectedCategory);
    const [nextCursor, setNextCursor] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const latestRequest = useRef(0);

    const categories = [
        "Protein",
        "PreWorkout",
        "Creatine",
        "MassGainer",
        "BCAA",
        "Multivitamin",
        "FishOil",
        "Accessories",
    ];

    const getProducts = async (cursor = null, loadMore = false) => {
        const requestId = ++latestRequest.current;
        try {
            if (loadMore) {
                setLoadingMore(true);
            }

            const response = await axiosInstance.get(`/products`, {
                params: {
                    limit: 20,
                    ...filters,
                    ...(cursor && { cursor }),
                },
            });

            const newProducts = response.data.products || [];

            // A cached request can return after a newer category request.
            // Ignore it so it cannot overwrite the current category's results.
            if (requestId !== latestRequest.current) return;

            if (loadMore) {
                setProducts((prev) => [...prev, ...newProducts]);
            } else {
                setProducts(newProducts);
            }

            setNextCursor(response.data.nextCursor || null);

        } catch (error) {
            console.log(error);
        } finally {
            if (requestId === latestRequest.current) {
                setLoadingMore(false);
            }
        }
    };

    useEffect(() => {
        setNextCursor(null);
        getProducts();
    }, [filters]);

    useEffect(() => {
        setActiveCategory(selectedCategory);
        setFilters((prev) => (
            prev.category === selectedCategory
                ? prev
                : { ...prev, category: selectedCategory }
        ));
    }, [selectedCategory]);

    const handleLoadMore = () => {
        if (!nextCursor || loadingMore) return;

        getProducts(nextCursor, true);
    };

    const handleCategory = (category) => {
        setActiveCategory(category);

        setFilters((prev) => ({
            ...prev,
            category: category,
        }));
    };

    const handlePriceChange = (type, value) => {
        if (type === "min") {
            if (value > maxPrice) {
                return;
            }

            setMinPrice(value);
        } else {
            if (value < minPrice) {
                return;
            }

            setMaxPrice(value);
        }
    };

    const handlesubmit = (e) => {
        e.preventDefault();

        setFilters((prev) => ({
            ...prev,
            minPrice: minPrice,
            maxPrice: maxPrice,
        }));
    };

    const handleMobileSubmit = (e) => {
        handlesubmit(e);
        setFilterOpen(false);
    };

    const handleReset = () => {
        setFilters({
            category: "",
            minPrice: "",
            maxPrice: "",
            sort: ""
        });

        setMinPrice(0);
        setMaxPrice(5999);
        setActiveCategory("");
    };

    return (
        <div className="flex flex-col flex-1 min-h-0 w-full overflow-hidden bg-white">

            {/* =====================================================
                MOBILE FILTER BUTTON
            ====================================================== */}

            <div className="md:hidden w-full flex justify-end px-5 py-4 bg-white border-b border-neutral-200 shrink-0">
                <button
                    onClick={() => setFilterOpen(true)}
                    className="
                        bg-[#171717]
                        text-white
                        px-5
                        py-2.5
                        rounded-md
                        text-sm
                        font-semibold
                        shadow-sm
                        cursor-pointer
                        hover:bg-[#3B82F6]
                        transition-colors
                        duration-200
                    "
                >
                    Filters
                </button>
            </div>


            {/* =====================================================
                SIDEBAR + PRODUCTS ROW
            ====================================================== */}

            <div className="flex flex-1 min-h-0 w-full overflow-hidden">

                {/* =====================================================
                    DESKTOP SIDEBAR
                ====================================================== */}

                <aside className="hidden md:flex md:flex-col w-70 shrink-0 bg-white border-r border-[#E5E5E5] min-h-0">

                    <div className="flex-1 min-h-0 overflow-y-auto">

                        <h1 className="text-2xl font-extrabold text-[#171717] tracking-tight ml-6 mt-6 mb-6">
                            Filters
                        </h1>


                        {/* SORT */}

                        <div className="ml-6 mb-7">

                            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">
                                Sort By Price
                            </h2>

                            <div className="flex gap-2">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            sort: "price_asc"
                                        }))
                                    }
                                    className={`
                                        px-3 py-2
                                        text-sm
                                        font-semibold
                                        rounded-md
                                        border
                                        transition-colors
                                        cursor-pointer
                                        ${filters.sort === "price_asc"
                                            ? "bg-[#171717] text-white border-[#171717]"
                                            : "bg-white text-neutral-700 border-neutral-300 hover:border-[#3B82F6]"
                                        }
                                    `}
                                >
                                    Price ↑
                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            sort: "price_desc"
                                        }))
                                    }
                                    className={`
                                        px-3 py-2
                                        text-sm
                                        font-semibold
                                        rounded-md
                                        border
                                        transition-colors
                                        cursor-pointer
                                        ${filters.sort === "price_desc"
                                            ? "bg-[#171717] text-white border-[#171717]"
                                            : "bg-white text-neutral-700 border-neutral-300 hover:border-[#3B82F6]"
                                        }
                                    `}
                                >
                                    Price ↓
                                </button>

                            </div>
                        </div>


                        <form onSubmit={handlesubmit}>

                            {/* CATEGORIES */}

                            <div className="ml-2">

                                <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 ml-6 mb-4">
                                    Categories
                                </h2>

                                <div className="flex flex-col gap-3.5 mb-2">

                                    {categories.map((category) => (
                                        <p
                                            key={category}
                                            onClick={() => handleCategory(category)}
                                            className={`
                                                text-[15px]
                                                font-medium
                                                ml-6
                                                cursor-pointer
                                                transition-colors
                                                duration-200
                                                hover:text-[#3B82F6]
                                                ${activeCategory === category
                                                    ? "text-[#3B82F6]"
                                                    : "text-neutral-600"
                                                }
                                            `}
                                        >
                                            {category}
                                        </p>
                                    ))}

                                </div>
                            </div>


                            {/* PRICE */}

                            <div className="ml-2 mt-8">

                                <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 ml-6 mb-5">
                                    Price
                                </h2>

                                <div className="ml-6 mr-6">

                                    <div className="relative h-6 flex items-center">

                                        <div className="absolute w-full h-1 bg-[#EDEDED] rounded-full" />

                                        <div
                                            className="absolute h-1 bg-[#3B82F6] rounded-full"
                                            style={{
                                                left: `${(minPrice / 5999) * 100}%`,
                                                right: `${100 - (maxPrice / 5999) * 100}%`,
                                            }}
                                        />

                                        {/* MIN */}

                                        <input
                                            type="range"
                                            min="0"
                                            max="5999"
                                            value={minPrice}
                                            onChange={(e) =>
                                                handlePriceChange(
                                                    "min",
                                                    Number(e.target.value)
                                                )
                                            }
                                            className="
                                                absolute
                                                w-full
                                                appearance-none
                                                bg-transparent
                                                pointer-events-none
                                                [&::-webkit-slider-thumb]:appearance-none
                                                [&::-webkit-slider-thumb]:w-4
                                                [&::-webkit-slider-thumb]:h-4
                                                [&::-webkit-slider-thumb]:rounded-full
                                                [&::-webkit-slider-thumb]:bg-[#3B82F6]
                                                [&::-webkit-slider-thumb]:shadow-sm
                                                [&::-webkit-slider-thumb]:pointer-events-auto
                                                [&::-webkit-slider-thumb]:cursor-pointer
                                                [&::-moz-range-thumb]:appearance-none
                                                [&::-moz-range-thumb]:w-4
                                                [&::-moz-range-thumb]:h-4
                                                [&::-moz-range-thumb]:border-0
                                                [&::-moz-range-thumb]:rounded-full
                                                [&::-moz-range-thumb]:bg-[#3B82F6]
                                                [&::-moz-range-thumb]:pointer-events-auto
                                                [&::-moz-range-thumb]:cursor-pointer
                                            "
                                        />


                                        {/* MAX */}

                                        <input
                                            type="range"
                                            min="0"
                                            max="5999"
                                            value={maxPrice}
                                            onChange={(e) =>
                                                handlePriceChange(
                                                    "max",
                                                    Number(e.target.value)
                                                )
                                            }
                                            className="
                                                absolute
                                                w-full
                                                appearance-none
                                                bg-transparent
                                                pointer-events-none
                                                [&::-webkit-slider-thumb]:appearance-none
                                                [&::-webkit-slider-thumb]:w-4
                                                [&::-webkit-slider-thumb]:h-4
                                                [&::-webkit-slider-thumb]:rounded-full
                                                [&::-webkit-slider-thumb]:bg-[#3B82F6]
                                                [&::-webkit-slider-thumb]:shadow-sm
                                                [&::-webkit-slider-thumb]:pointer-events-auto
                                                [&::-webkit-slider-thumb]:cursor-pointer
                                                [&::-moz-range-thumb]:appearance-none
                                                [&::-moz-range-thumb]:w-4
                                                [&::-moz-range-thumb]:h-4
                                                [&::-moz-range-thumb]:border-0
                                                [&::-moz-range-thumb]:rounded-full
                                                [&::-moz-range-thumb]:bg-[#3B82F6]
                                                [&::-moz-range-thumb]:pointer-events-auto
                                                [&::-moz-range-thumb]:cursor-pointer
                                            "
                                        />

                                    </div>


                                    <div className="flex justify-between text-xs font-medium mt-3">

                                        <span className="text-neutral-500">
                                            Min ₹{minPrice}
                                        </span>

                                        <span className="text-neutral-500">
                                            Max ₹{maxPrice}
                                        </span>

                                    </div>

                                </div>
                            </div>


                            {/* DESKTOP BUTTONS */}

                            <div className="mt-8 ml-6 flex items-center">

                                <button
                                    type="submit"
                                    className="
                                        text-sm
                                        font-semibold
                                        px-4
                                        py-2
                                        text-white
                                        rounded-md
                                        bg-[#171717]
                                        hover:bg-[#3B82F6]
                                        transition-colors
                                        duration-200
                                        cursor-pointer
                                    "
                                >
                                    Apply Filters
                                </button>

                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="
                                        ml-3
                                        text-sm
                                        font-semibold
                                        px-4
                                        py-2
                                        text-[#171717]
                                        rounded-md
                                        bg-white
                                        border
                                        border-neutral-300
                                        hover:bg-[#F7F7F7]
                                        transition-colors
                                        duration-200
                                        cursor-pointer
                                    "
                                >
                                    Reset
                                </button>

                            </div>

                        </form>

                    </div>


                    {/* DESKTOP SIDEBAR FOOTER */}

                    <div className="shrink-0 border-t border-neutral-200 px-6 py-6 bg-white">

                        <p className="text-sm font-extrabold text-[#171717]">
                            Sarab<span className="text-blue-600">.</span>Fitness
                        </p>

                        <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                            Genuine products. Trusted nutrition.
                        </p>

                        <div className="flex gap-4 mt-4 text-xs text-neutral-500">

                            <a
                                href="#"
                                className="hover:text-[#3B82F6]"
                            >
                                Contact
                            </a>

                            <a
                                href="#"
                                className="hover:text-[#3B82F6]"
                            >
                                Help
                            </a>

                            <a
                                href="#"
                                className="hover:text-[#3B82F6]"
                            >
                                Privacy
                            </a>

                        </div>

                        <div className="border-t border-neutral-100 mt-5 pt-4">

                            <p className="text-[11px] text-neutral-400">
                                © 2026 Sarab Fitness. All rights reserved.
                            </p>

                        </div>

                    </div>

                </aside>


                {/* =====================================================
                    MOBILE FULL SCREEN FILTER
                ====================================================== */}

                {filterOpen && (
                    <div className="fixed inset-0 z-50 bg-white md:hidden overflow-y-auto">

                        {/* HEADER */}

                        <div className="flex items-center justify-between px-5 py-5 border-b border-neutral-200">

                            <h1 className="text-2xl font-extrabold text-[#171717]">
                                Filters
                            </h1>

                            <button
                                onClick={() => setFilterOpen(false)}
                                className="
                                    w-9
                                    h-9
                                    flex
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-neutral-100
                                    text-neutral-700
                                    text-lg
                                    cursor-pointer
                                "
                            >
                                ✕
                            </button>

                        </div>


                        {/* FILTER CONTENT */}

                        <div className="px-5 py-6">

                            <form onSubmit={handleMobileSubmit}>

                                {/* CATEGORIES */}

                                <div>

                                    <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-5">
                                        Categories
                                    </h2>

                                    <div className="flex flex-col gap-5">

                                        {categories.map((category) => (
                                            <p
                                                key={category}
                                                onClick={() =>
                                                    handleCategory(category)
                                                }
                                                className={`
                                                    text-base
                                                    font-medium
                                                    cursor-pointer
                                                    transition-colors
                                                    ${activeCategory === category
                                                        ? "text-[#3B82F6]"
                                                        : "text-neutral-700"
                                                    }
                                                `}
                                            >
                                                {category}
                                            </p>
                                        ))}

                                    </div>

                                </div>


                                {/* PRICE */}

                                <div className="mt-12">

                                    <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-6">
                                        Price
                                    </h2>

                                    <div className="px-1">

                                        <div className="relative h-6 flex items-center">

                                            <div className="absolute w-full h-1 bg-[#EDEDED] rounded-full" />

                                            <div
                                                className="absolute h-1 bg-[#3B82F6] rounded-full"
                                                style={{
                                                    left: `${(minPrice / 5999) * 100}%`,
                                                    right: `${100 - (maxPrice / 5999) * 100}%`,
                                                }}
                                            />


                                            {/* MIN */}

                                            <input
                                                type="range"
                                                min="0"
                                                max="5999"
                                                value={minPrice}
                                                onChange={(e) =>
                                                    handlePriceChange(
                                                        "min",
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="
                                                    absolute
                                                    w-full
                                                    appearance-none
                                                    bg-transparent
                                                    pointer-events-none
                                                    [&::-webkit-slider-thumb]:appearance-none
                                                    [&::-webkit-slider-thumb]:w-5
                                                    [&::-webkit-slider-thumb]:h-5
                                                    [&::-webkit-slider-thumb]:rounded-full
                                                    [&::-webkit-slider-thumb]:bg-[#3B82F6]
                                                    [&::-webkit-slider-thumb]:pointer-events-auto
                                                    [&::-webkit-slider-thumb]:cursor-pointer
                                                    [&::-moz-range-thumb]:appearance-none
                                                    [&::-moz-range-thumb]:w-5
                                                    [&::-moz-range-thumb]:h-5
                                                    [&::-moz-range-thumb]:border-0
                                                    [&::-moz-range-thumb]:rounded-full
                                                    [&::-moz-range-thumb]:bg-[#3B82F6]
                                                    [&::-moz-range-thumb]:pointer-events-auto
                                                "
                                            />


                                            {/* MAX */}

                                            <input
                                                type="range"
                                                min="0"
                                                max="5999"
                                                value={maxPrice}
                                                onChange={(e) =>
                                                    handlePriceChange(
                                                        "max",
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="
                                                    absolute
                                                    w-full
                                                    appearance-none
                                                    bg-transparent
                                                    pointer-events-none
                                                    [&::-webkit-slider-thumb]:appearance-none
                                                    [&::-webkit-slider-thumb]:w-5
                                                    [&::-webkit-slider-thumb]:h-5
                                                    [&::-webkit-slider-thumb]:rounded-full
                                                    [&::-webkit-slider-thumb]:bg-[#3B82F6]
                                                    [&::-webkit-slider-thumb]:pointer-events-auto
                                                    [&::-webkit-slider-thumb]:cursor-pointer
                                                    [&::-moz-range-thumb]:appearance-none
                                                    [&::-moz-range-thumb]:w-5
                                                    [&::-moz-range-thumb]:h-5
                                                    [&::-moz-range-thumb]:border-0
                                                    [&::-moz-range-thumb]:rounded-full
                                                    [&::-moz-range-thumb]:bg-[#3B82F6]
                                                    [&::-moz-range-thumb]:pointer-events-auto
                                                "
                                            />

                                        </div>


                                        <div className="flex justify-between mt-4 text-sm font-medium">

                                            <span className="text-neutral-500">
                                                Min ₹{minPrice}
                                            </span>

                                            <span className="text-neutral-500">
                                                Max ₹{maxPrice}
                                            </span>

                                        </div>

                                    </div>

                                </div>


                                {/* MOBILE BUTTONS */}

                                <div className="flex gap-3 mt-12 pb-2">

                                    <button
                                        type="submit"
                                        className="
                                            flex-1
                                            py-3.5
                                            bg-[#171717]
                                            hover:bg-[#3B82F6]
                                            text-white
                                            rounded-lg
                                            font-semibold
                                            transition-colors
                                            cursor-pointer
                                        "
                                    >
                                        Apply Filters
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="
                                            px-6
                                            py-3.5
                                            border
                                            border-neutral-300
                                            rounded-lg
                                            font-semibold
                                            text-[#171717]
                                            hover:bg-neutral-50
                                            cursor-pointer
                                        "
                                    >
                                        Reset
                                    </button>

                                </div>

                            </form>

                        </div>


                        {/* MOBILE FILTER FOOTER */}

                        <div className="border-t border-neutral-200 px-5 py-8 bg-white">

                            <p className="text-base font-extrabold text-[#171717]">
                                Sarab<span className="text-blue-600">.</span>Fitness
                            </p>

                            <p className="text-sm text-neutral-400 mt-2">
                                Genuine products. Trusted nutrition.
                            </p>

                            <div className="flex gap-5 mt-5 text-sm text-neutral-500">

                                <a
                                    href="#"
                                    className="hover:text-[#3B82F6] transition-colors"
                                >
                                    Contact
                                </a>

                                <a
                                    href="#"
                                    className="hover:text-[#3B82F6] transition-colors"
                                >
                                    Help
                                </a>

                                <a
                                    href="#"
                                    className="hover:text-[#3B82F6] transition-colors"
                                >
                                    Privacy
                                </a>

                            </div>

                            <div className="border-t border-neutral-100 mt-6 pt-4">

                                <p className="text-xs text-neutral-400">
                                    © 2026 Sarab Fitness. All rights reserved.
                                </p>

                            </div>

                        </div>

                    </div>
                )}


                {/* =====================================================
                    PRODUCTS + FOOTER
                ====================================================== */}

                <main
                    className="
                        flex-1
                        min-w-0
                        overflow-y-auto
                        [&::-webkit-scrollbar]:hidden
                        [-ms-overflow-style:none]
                        scrollbar-none
                        bg-white
                    "
                >

                    {/* PRODUCTS */}

                    <div className="w-[94%] max-w-350 mx-auto py-10">

                        <p className="text-xs font-semibold uppercase tracking-wider text-[#3B82F6] mb-2">
                            {activeCategory || "All Products"}
                        </p>

                        <h1 className="text-2xl md:text-3xl font-extrabold mb-6 md:mb-8 text-[#171717] tracking-tight">
                            {activeCategory ? `${activeCategory} Products` : "Buy 100% Trusted Products"}
                        </h1>


                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 w-full">

                            {products.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                />
                            ))}

                        </div>


                        {/* LOAD MORE */}

                        {nextCursor && (
                            <div className="flex justify-center py-10">

                                <button
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                    className="
                                        px-8
                                        py-3
                                        rounded-md
                                        bg-[#171717]
                                        text-white
                                        text-sm
                                        font-semibold
                                        hover:bg-[#3B82F6]
                                        transition-colors
                                        duration-200
                                        cursor-pointer
                                        disabled:opacity-60
                                        disabled:cursor-not-allowed
                                    "
                                >
                                    {loadingMore ? "Loading..." : "Load More"}
                                </button>

                            </div>
                        )}

                    </div>


                    {/* FOOTER */}

                    <footer className="bg-neutral-900 text-neutral-400 pt-16 px-6 mt-16">

                        <div className="
                            max-w-7xl
                            mx-auto
                            grid
                            sm:grid-cols-2
                            lg:grid-cols-4
                            gap-12
                            pb-12
                            border-b
                            border-neutral-800
                        ">

                            {/* BRAND */}

                            <div>

                                <p className="text-xl font-extrabold text-white mb-4">
                                    Sarab<span className="text-blue-600">.</span>Fitness
                                </p>

                                <p className="text-sm leading-relaxed max-w-xs">
                                    Sports nutrition for the daily grind — genuine
                                    products, honest pricing, and delivery that
                                    actually shows up on time.
                                </p>

                            </div>


                            {/* SHOP */}

                            <div>

                                <p className="text-xs font-bold uppercase tracking-wide text-white mb-5">
                                    Shop
                                </p>

                                <ul className="space-y-3 text-sm">
                                    <li><a href="#" className="hover:text-white">Protein</a></li>
                                    <li><a href="#" className="hover:text-white">PreWorkout</a></li>
                                    <li><a href="#" className="hover:text-white">Creatine</a></li>
                                    <li><a href="#" className="hover:text-white">Mass Gainer</a></li>
                                    <li><a href="#" className="hover:text-white">Accessories</a></li>
                                </ul>

                            </div>


                            {/* COMPANY */}

                            <div>

                                <p className="text-xs font-bold uppercase tracking-wide text-white mb-5">
                                    Company
                                </p>

                                <ul className="space-y-3 text-sm">
                                    <li><a href="#" className="hover:text-white">About us</a></li>
                                    <li><a href="#" className="hover:text-white">Contact</a></li>
                                    <li><a href="#" className="hover:text-white">Track order</a></li>
                                    <li><a href="#" className="hover:text-white">FAQs</a></li>
                                </ul>

                            </div>


                            {/* POLICIES */}

                            <div>

                                <p className="text-xs font-bold uppercase tracking-wide text-white mb-5">
                                    Policies
                                </p>

                                <ul className="space-y-3 text-sm">
                                    <li><a href="#" className="hover:text-white">Privacy policy</a></li>
                                    <li><a href="#" className="hover:text-white">Terms of service</a></li>
                                    <li><a href="#" className="hover:text-white">Refund & return</a></li>
                                    <li><a href="#" className="hover:text-white">Shipping policy</a></li>
                                </ul>

                            </div>

                        </div>


                        {/* BOTTOM */}

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
                        ">

                            <span>
                                © 2026 Sarab Fitness. All rights reserved.
                            </span>

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

                </main>

            </div>

        </div>
    );
};

export default MainArea;  
