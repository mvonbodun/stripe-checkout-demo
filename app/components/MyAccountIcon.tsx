"use client";
import React from "react";
import { useMyAccountUI } from "../my-account-ui-context";

interface MyAccountIconProps {
  className?: string;
}

const MyAccountIcon: React.FC<MyAccountIconProps> = ({
  className = "",
}) => {
  const { openMyAccount } = useMyAccountUI();

  return (
    <button
      className={`text-gray-600 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1 ${className}`}
      aria-label="My Account"
      onClick={openMyAccount}
    >
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
    </button>
  );
};

export default MyAccountIcon;
