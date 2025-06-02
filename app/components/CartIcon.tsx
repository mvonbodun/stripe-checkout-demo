"use client";
import React from "react";
import { useCart } from "../cart-context";


interface CartIconProps {
  onClick?: () => void;
}

const CartIcon: React.FC<CartIconProps> = ({ onClick }) => {
  const { state: cart } = useCart();
  const itemCount = cart.line_items.reduce((sum: number, item: typeof cart.line_items[number]) => sum + item.quantity, 0);

  return (
    <button
      type="button"
      className="relative block bg-transparent border-none p-0 m-0 cursor-pointer focus:outline-none"
      aria-label="Open mini cart"
      onClick={onClick}
    >
      {/* Cart SVG icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-8 h-8 text-gray-700"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437m0 0l1.7 6.374a2.25 2.25 0 002.183 1.704h7.334a2.25 2.25 0 002.183-1.704l1.7-6.374m-14.487 0h14.487"
        />
        <circle cx="9" cy="20" r="1.25" />
        <circle cx="17" cy="20" r="1.25" />
      </svg>
      {/* Quantity badge */}
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow">
          {itemCount}
        </span>
      )}
    </button>
  );
}

export default CartIcon;

