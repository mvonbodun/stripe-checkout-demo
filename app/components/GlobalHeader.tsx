"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import CartIcon from "./CartIcon";
import { PromotionalOffer } from "../api/promotional-offers/route";
import { CatalogCategory } from "../api/catalog-categories/route";

interface GlobalHeaderProps {
  onCartClick: () => void;
}

const GlobalHeader: React.FC<GlobalHeaderProps> = ({ onCartClick }) => {
  const [offers, setOffers] = useState<PromotionalOffer[]>([]);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const firstRowRef = useRef<HTMLDivElement>(null);
  const secondRowRef = useRef<HTMLDivElement>(null);
  const thirdRowRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch promotional offers and categories
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [offersResponse, categoriesResponse] = await Promise.all([
          fetch("/api/promotional-offers"),
          fetch("/api/catalog-categories"),
        ]);

        if (offersResponse.ok) {
          const offersData = await offersResponse.json();
          setOffers(offersData);
        }

        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error("Error fetching header data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Rotate promotional offers
  useEffect(() => {
    if (offers.length > 1) {
      const interval = setInterval(() => {
        setCurrentOfferIndex((prev) => (prev + 1) % offers.length);
      }, 4000); // Change offer every 4 seconds

      return () => clearInterval(interval);
    }
  }, [offers.length]);

  // Debounced scroll handler for better performance
  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      setScrollY(window.scrollY);
    }, 10); // Small delay for smooth performance
  }, []);

  // Handle scroll events
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  // Calculate scroll-based visibility
  const thirdRowHeight = 56; // Use fixed height instead of dynamic measurement

  // Third row starts disappearing immediately on scroll
  const thirdRowTransform = Math.min(scrollY, thirdRowHeight);

  // First row starts disappearing only after third row is completely hidden
  const firstRowTransform = Math.max(0, scrollY - thirdRowHeight);

  return (
    <>
      {/* First Row - Promotional Offers (Can disappear) */}
      <div
        ref={firstRowRef}
        className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden transition-transform duration-300 ease-out"
        style={{
          height: "44px", // Fixed height to prevent layout shift
          transform: `translateY(-${firstRowTransform}px)`,
        }}
        role="banner"
        aria-label="Promotional offers"
      >
        <div className="max-w-7xl mx-auto text-center h-full flex items-center justify-center px-6">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-pulse promotional-text text-sm">
                Loading offers...
              </div>
            </div>
          ) : offers.length > 0 ? (
            <div className="flex items-center justify-center space-x-4">
              <span className="promotional-text text-sm">
                {offers[currentOfferIndex]?.text}
              </span>
              {offers.length > 1 && (
                <div
                  className="flex space-x-1"
                  role="tablist"
                  aria-label="Offer indicators"
                >
                  {offers.map((_, index) => (
                    <button
                      key={index}
                      role="tab"
                      aria-selected={index === currentOfferIndex}
                      className={`w-2 h-2 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                        index === currentOfferIndex ? "bg-white" : "bg-white/50"
                      }`}
                      onClick={() => setCurrentOfferIndex(index)}
                      aria-label={`View offer ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="promotional-text text-sm opacity-0">
              Placeholder
            </div>
          )}
        </div>
      </div>

      {/* Second Row - Logo and Cart (Always Anchored at Top) */}
      <div
        ref={secondRowRef}
        className="fixed left-0 right-0 z-50 bg-white border-b shadow-sm"
        style={{
          height: "56px", // Fixed height to match third row
          top: `${Math.max(0, 44 - firstRowTransform)}px`, // Use fixed height instead of offsetHeight
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center h-full pl-2 pr-6">
          {/* Left Section - Fixed */}
          <div className="flex items-center space-x-6 flex-shrink-0">
            <Link
              href="/"
              className="text-lg font-semibold text-gray-800 no-underline hover:no-underline focus:no-underline active:no-underline hover:text-gray-600 transition-colors focus:outline-none"
              aria-label="Go to homepage"
            >
              Stripe Checkout Demo
            </Link>

            {/* Store Location */}
            <div className="flex items-center text-sm text-gray-600">
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
              <span className="font-medium">My Store:</span>
              <span className="ml-1">Spring, TX</span>
            </div>
          </div>

          {/* Center Section - Expandable Search */}
          <div className="flex-grow mx-6">
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
              </div>
              <input
                type="search"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Right Section - Fixed */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {/* Help Icon */}
            <button
              className="text-gray-600 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1"
              aria-label="Help and support"
              onClick={() => {}}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                />
              </svg>
            </button>

            {/* My Account Icon */}
            <button
              className="text-gray-600 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1"
              aria-label="My Account"
              onClick={() => {}}
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

            <CartIcon onClick={onCartClick} />
          </div>
        </div>
      </div>

      {/* Third Row - Categories (Can slide under second row) */}
      <div
        ref={thirdRowRef}
        className="fixed left-0 right-0 z-30 bg-gray-50 border-b transition-transform duration-300 ease-out"
        style={{
          height: "56px", // Fixed height to prevent layout shift
          top: `${Math.max(0, 44 - firstRowTransform) + 56}px`, // Use fixed heights (44 + 56)
          transform: `translateY(-${thirdRowTransform}px)`,
        }}
        role="navigation"
        aria-label="Product categories"
      >
        <div className="max-w-7xl mx-auto h-full px-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse header-nav text-sm text-gray-500">
                Loading categories...
              </div>
            </div>
          ) : (
            <nav className="flex items-center justify-center space-x-2 md:space-x-8 overflow-x-auto scrollbar-hide h-full">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="header-nav text-sm text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap py-2 px-3 rounded-md hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:bg-white/80"
                  title={category.description || category.name}
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </>
  );
};

export default GlobalHeader;
