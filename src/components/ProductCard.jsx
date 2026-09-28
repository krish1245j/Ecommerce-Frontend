import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import { addToCart } from "../api/cart";
import { getProduct } from "../api/productBuy";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle"); // idle | loading | added | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleAddToCart = async (e) => {
    if (status === "loading") return;

    setStatus("loading");
    setErrorMsg("");
    e.stopPropagation();
    try {
      await addToCart(product._id, 1);
      setStatus("added");
      setTimeout(() => setStatus("idle"), 1500);
    } catch (err) {
      const message = err.response?.data?.message;

      if (err.response?.status === 401) {
        navigate("/login");
        return;
      }

      setErrorMsg(message || "Couldn't add to cart");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  const handleProduct= async()=>{
    navigate(`/product/${product._id}`)
  }

  return (
    <div onClick={handleProduct} className="
      cursor-pointer
      w-full
      min-w-0
      min-h-70
      sm:min-h-80
      bg-white
      border
      border-[#E5E5E5]
      rounded-lg
      flex
      flex-col
      overflow-hidden
      hover:shadow-md
      hover:border-neutral-300
      transition-all
      duration-200
    ">

      {/* IMAGE */}
      <div className="
        h-45
        sm:h-52.5
        w-full
        shrink-0
        bg-[#F7F7F7]
        border-b
        border-[#E5E5E5]
        flex
        items-center
        justify-center
        overflow-hidden
      ">
        <img
          src={product.image}
          alt={product.pname}
          className="w-full h-full object-cover"
        />
      </div>

      {/* INFORMATION */}
      <div className="flex-1 min-w-0 p-3 flex flex-col">

        <p className="
    text-sm
    sm:text-sm
    font-medium
    leading-4
    sm:leading-5
    text-neutral-800
    line-clamp-2
    wrap-break-word
  ">
          {product.pname}
        </p>

        <p className="mt-1.5 text-sm sm:text-base font-bold text-[#171717]">
          ₹{product.price}
        </p>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={status === "loading"}
          className={`
      mt-2
      w-[65%]
      py-1.5
      text-white
      text-xs
      sm:text-sm
      font-semibold
      rounded-md
      transition-colors
      duration-200
      cursor-pointer
      disabled:cursor-not-allowed
      flex
      items-center
      justify-center
      gap-1.5
      ${status === "added" ? "bg-green-600" : "bg-[#171717] hover:bg-[#3B82F6]"}
    `}
        >
          {status === "loading" && <Loader2 size={14} className="animate-spin" />}
          {status === "added" && <Check size={14} />}
          {status === "loading"
            ? "Adding..."
            : status === "added"
              ? "Added"
              : "Add to Cart"}
        </button>

        {status === "error" && (
          <p className="mt-1.5 text-[11px] text-red-500 leading-tight">
            {errorMsg}
          </p>
        )}

      </div>

    </div>
  );
};

export default ProductCard;
