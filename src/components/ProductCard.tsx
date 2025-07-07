// components/ProductCard.tsx
import React, { useState } from "react";
import { FaYoutube, FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { useFirebase } from "@/Services/context";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: any; // you can strongly type it if needed
}

export const ProductCardComponent: React.FC<ProductCardProps> = React.memo(({ product }) => {
  const { toggleCart, cartItems, updateCartQty, toggleWishList, wishlistIds } = useFirebase();
  const productImages = [product.productImageURL, product.productImageURL2].filter(Boolean);
  const isInWishlist = wishlistIds.includes(product.id);
  const currentProduct = cartItems?.[product.productId];
  const qty = currentProduct?.qty || 0;

  const [showZoom, setShowZoom] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  return (
    <>
      <div className="bg-white rounded-xl shadow hover:shadow-md transition p-4 flex flex-col">
        <img
          src={productImages[0]}
          alt={product.productName}
          className="rounded-md h-[250px] w-full object-cover mb-3 cursor-pointer"
          onClick={() => setShowZoom(true)}
        />

        <div className="text-center mb-2">
          <p className="text-sm text-gray-500 line-clamp-2">{product.productName}</p>
        </div>
        <div className="text-center mb-2">
          <span className="text-red-500 line-through">₹{product.beforeDiscPrice?.toFixed(2)}</span>
          <span className="text-emerald-600 font-bold ml-2">₹{product.salesPrice?.toFixed(2)}</span>
        </div>

        <div className="mt-auto flex justify-between items-center">
          {product.youtubeURL && (
            <a href={product.youtubeURL} target="_blank" rel="noopener noreferrer">
              <FaYoutube className="text-red-500 text-3xl cursor-pointer" />
            </a>
          )}

          {qty > 0 ? (
            <div className="flex items-center mx-auto gap-2">
              <button
                onClick={() => updateCartQty(product.productId, "dec")}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => updateCartQty(product.productId, parseInt(e.target.value))}
                className="w-16 text-center border rounded px-2 py-1"
              />
              <button
                onClick={() => updateCartQty(product.productId, "inc")}
                className="px-2 py-1 bg-green-500 text-white rounded"
              >
                +
              </button>
            </div>
          ) : (
            <Button
              className="bg-green-500 text-white px-6 py-2 rounded-full mx-auto"
              onClick={() => toggleCart(product)}
            >
              Add To Cart
            </Button>
          )}

          <button
            onClick={() => {
              toggleWishList(product.id);
              toast.success(isInWishlist ? "Product is removed from wishlist" : "Product is added to wishlist");
            }}
          >
            {isInWishlist ? (
              <FaHeart className="text-2xl text-red-500" />
            ) : (
              <CiHeart className="text-3xl" />
            )}
          </button>
        </div>
      </div>

      {/* ✅ Zoom Dialog */}
      {showZoom && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
          onClick={() => setShowZoom(false)}
        >
          <div
            className="relative bg-white p-2 rounded-md max-w-[90%] max-h-[90%] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={productImages[activeImage]}
              alt={`Zoom ${product.productName}`}
              className="max-h-[80vh] object-contain rounded mb-2"
            />
            {productImages.length > 1 && (
              <div className="flex gap-2 mt-1">
                {productImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumb ${idx}`}
                    onClick={() => setActiveImage(idx)}
                    className={`w-14 h-14 object-cover rounded border cursor-pointer ${
                      activeImage === idx ? "border-green-500" : "border-gray-300"
                    }`}
                  />
                ))}
              </div>
            )}
            <button
              onClick={() => setShowZoom(false)}
              className="absolute top-2 right-2 bg-black text-white px-2 py-1 text-sm rounded-full"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
});
