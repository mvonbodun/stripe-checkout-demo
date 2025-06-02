"use client";

import React from "react";

interface HeaderStoreLocationProps {
  storeLabel?: string;
  location?: string;
  className?: string;
  showIcon?: boolean;
}

const HeaderStoreLocation: React.FC<HeaderStoreLocationProps> = ({
  storeLabel = "My Store:",
  location = "Spring, TX",
  className = "",
  showIcon = true,
}) => {
  return (
    <div className={`flex items-center text-sm text-gray-600 ${className}`}>
      {showIcon && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
          />
        </svg>
      )}
      <span className="font-medium">{storeLabel}</span>
      <span className="ml-1">{location}</span>
    </div>
  );
};

export default HeaderStoreLocation;
