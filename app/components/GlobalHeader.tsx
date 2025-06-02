"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import CartIcon from "./CartIcon";
import HeaderPromotion from "./HeaderPromotion";
import HeaderLogo from "./HeaderLogo";
import HeaderStoreLocation from "./HeaderStoreLocation";
import HeaderSearchBar from "./HeaderSearchBar";
import HelpIcon from "./HelpIcon";
import MyAccountIcon from "./MyAccountIcon";
import HamburgerMenu from "./HamburgerMenu";
import HeaderCategoriesNavigation from "./HeaderCategoriesNavigation";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      <HeaderPromotion
        offers={offers}
        currentOfferIndex={currentOfferIndex}
        isLoading={isLoading}
        onOfferChange={setCurrentOfferIndex}
        transform={firstRowTransform}
      />

      {/* Second Row - Logo and Cart (Always Anchored at Top) */}
      <div
        ref={secondRowRef}
        className="fixed left-0 right-0 z-50 bg-white shadow-sm"
        style={{
          height: "56px", // Fixed height to match third row
          top: `${Math.max(0, 44 - firstRowTransform)}px`, // Use fixed height instead of offsetHeight
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center h-full pl-2 pr-6">
          {/* Desktop/Tablet Layout (md and up) */}
          <div className="hidden md:flex items-center w-full">
            {/* Left Section - Fixed */}
            <div className="flex items-center space-x-6 flex-shrink-0">
              {/* Logo and Store Name */}
              <HeaderLogo />

              {/* Store Location */}
              <HeaderStoreLocation />
            </div>

            {/* Center Section - Expandable Search */}
            <HeaderSearchBar />

            {/* Right Section - Fixed */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              <HelpIcon />
              <MyAccountIcon />
              <CartIcon onClick={onCartClick} />
            </div>
          </div>

          {/* Mobile Layout (below md breakpoint) */}
          <div className="flex md:hidden items-center justify-between w-full">
            {/* Left - Hamburger Menu */}
            <HamburgerMenu 
              isOpen={isMobileMenuOpen} 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex-shrink-0"
            />

            {/* Center - Logo */}
            <div className="flex-1 flex justify-center">
              <HeaderLogo />
            </div>

            {/* Right - Cart */}
            <div className="flex-shrink-0">
              <CartIcon onClick={onCartClick} />
            </div>
          </div>
        </div>
      </div>

      {/* Third Row - Categories (Can slide under second row) - Desktop/Tablet Only */}
      <div
        ref={thirdRowRef}
        className="hidden md:block fixed left-0 right-0 z-30 bg-gray-100 transition-transform duration-300 ease-out"
        style={{
          height: "48px", // Reduced height from 56px to 48px
          top: `${Math.max(0, 44 - firstRowTransform) + 56}px`, // Use fixed heights (44 + 56)
          transform: `translateY(-${thirdRowTransform}px)`,
        }}
        role="navigation"
        aria-label="Product categories"
      >
        <HeaderCategoriesNavigation categories={categories} isLoading={isLoading} />
      </div>

      {/* Mobile Layout - Third Row: Search Bar (Full Width) */}
      <div
        className="md:hidden fixed left-0 right-0 z-30 bg-white border-t border-gray-200"
        style={{
          height: "56px",
          top: `${Math.max(0, 44 - firstRowTransform) + 56}px`, // Position below second row
        }}
      >
        <div className="max-w-7xl mx-auto h-full px-4 flex items-center">
          <HeaderSearchBar className="mx-0" />
        </div>
      </div>

      {/* Mobile Layout - Fourth Row: Store Location */}
      <div
        className="md:hidden fixed left-0 right-0 z-30 bg-gray-50 border-t border-gray-200"
        style={{
          height: "48px",
          top: `${Math.max(0, 44 - firstRowTransform) + 56 + 56}px`, // Position below third row
        }}
      >
        <div className="max-w-7xl mx-auto h-full px-4 flex items-center">
          <HeaderStoreLocation />
        </div>
      </div>
    </>
  );
};

export default GlobalHeader;
