"use client";

import React from "react";
import Link from "next/link";

interface HeaderLogoProps {
  storeName?: string;
  href?: string;
  className?: string;
}

const HeaderLogo: React.FC<HeaderLogoProps> = ({
  storeName = "Stripe Checkout Demo",
  href = "/",
  className = "",
}) => {
  return (
    <Link
      href={href}
      className={`text-lg font-semibold text-gray-800 no-underline hover:no-underline focus:no-underline active:no-underline hover:text-gray-600 transition-colors focus:outline-none ${className}`}
      aria-label="Go to homepage"
    >
      {storeName}
    </Link>
  );
};

export { HeaderLogo };
export default HeaderLogo;
