"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import CartIcon from "./CartIcon";
import HeaderPromotion from "./HeaderPromotion";
import HeaderLogo from "./HeaderLogo";
import HeaderStoreLocation from "./HeaderStoreLocation";
import AutocompleteSearch from "./search/AutocompleteSearch";
import HelpIcon from "./HelpIcon";
import MyAccountIcon from "./MyAccountIcon";
import HamburgerMenu from "./HamburgerMenu";
import HeaderCategoriesNavigation from "./HeaderCategoriesNavigation";
import { PromotionalOffer } from "../api/promotional-offers/route";

interface GlobalHeaderProps {
  onMobileHeaderProgressChange?: (progress: number) => void;
}

import { useMiniCartUI } from '../mini-cart-ui-context';
import { useMobileMenuUI } from '../mobile-menu-ui-context';
import { useCategories } from '../categories-context';

const GlobalHeader: React.FC<GlobalHeaderProps> = ({ onMobileHeaderProgressChange }) => {
  const { openMiniCart } = useMiniCartUI();
  const { isMobileMenuOpen, openMobileMenu, closeMobileMenu } = useMobileMenuUI();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const [offers, setOffers] = useState<PromotionalOffer[]>([]);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const secondRowRef = useRef<HTMLDivElement>(null);
  const thirdRowRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch promotional offers only (categories are handled by context)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const offersResponse = await fetch("/api/promotional-offers");

        if (offersResponse.ok) {
          const offersData = await offersResponse.json();
          setOffers(offersData);
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

  // Debounced scroll handler for better performance, especially on mobile
  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      setScrollY(window.scrollY);
    }, isMobile ? 16 : 10); // Longer delay on mobile for better performance
  }, [isMobile]);

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

  // Handle mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial state
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate scroll-based visibility
  const thirdRowHeight = 56; // Use fixed height instead of dynamic measurement

  // Mobile header hiding logic - starts after ~20px scroll once promotional header disappears
  const mobileHideStart = 20; // Start hiding after promotional header begins to disappear
  const mobileHideDistance = 80; // Smooth transition over 80px of scroll
  
  // Calculate mobile row transforms
  const mobileHideProgress = Math.max(0, Math.min(1, (scrollY - mobileHideStart) / mobileHideDistance));
  const mobileSecondRowTransform = isMobile ? mobileHideProgress * 56 * 2 : 0; // Double the transform for complete hiding
  const mobileThirdRowTransform = mobileHideProgress * 56 * 2; // Double the transform for complete hiding
  const mobileFourthRowTransform = mobileHideProgress * 48 * 2; // Double the transform for complete hiding

  // Notify parent about mobile header state changes
  useEffect(() => {
    if (onMobileHeaderProgressChange && isMobile) {
      onMobileHeaderProgressChange(mobileHideProgress);
    }
  }, [mobileHideProgress, onMobileHeaderProgressChange, isMobile]);

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
        className="fixed left-0 right-0 z-50 bg-white shadow-sm transition-transform duration-300 ease-out"
        style={{
          height: "56px", // Fixed height to match third row
          top: `${Math.max(0, 44 - firstRowTransform)}px`, // Use fixed height instead of offsetHeight
          transform: isMobile ? `translateY(-${mobileSecondRowTransform}px)` : 'translateY(0)',
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
            <AutocompleteSearch />

            {/* Right Section - Fixed */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              <HelpIcon />
              <MyAccountIcon />
              <CartIcon onClick={openMiniCart} />
            </div>
          </div>

          {/* Mobile Layout (below md breakpoint) */}
          <div className="flex md:hidden items-center justify-between w-full">
            {/* Left - Hamburger Menu */}
            <HamburgerMenu 
              isOpen={isMobileMenuOpen} 
              onClick={() => isMobileMenuOpen ? closeMobileMenu() : openMobileMenu()}
              className="flex-shrink-0"
              ariaLabel="Open mobile menu"
            />

            {/* Center - Logo */}
            <div className="flex-1 flex justify-center">
              <HeaderLogo />
            </div>

            {/* Right - Cart */}
            <div className="flex-shrink-0">
              <CartIcon onClick={openMiniCart} />
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
        <HeaderCategoriesNavigation categories={categories} isLoading={categoriesLoading} />
      </div>

      {/* Mobile Layout - Third Row: Search Bar (Full Width) */}
      <div
        className="md:hidden fixed left-0 right-0 z-30 bg-white border-t border-gray-200 transition-transform duration-300 ease-out"
        style={{
          height: "56px",
          top: `${Math.max(0, 44 - firstRowTransform) + 56 - mobileSecondRowTransform}px`, // Position below second row, accounting for transforms
          transform: `translateY(-${mobileThirdRowTransform}px)`,
        }}
      >
        <div className="max-w-7xl mx-auto h-full px-3 flex items-center">
          <AutocompleteSearch className="mx-0" />
        </div>
      </div>

      {/* Mobile Layout - Fourth Row: Store Location */}
      <div
        className="md:hidden fixed left-0 right-0 z-30 bg-gray-50 border-t border-b border-gray-200 transition-transform duration-300 ease-out"
        style={{
          height: "48px",
          top: `${Math.max(0, 44 - firstRowTransform) + 56 + 56 - mobileSecondRowTransform - mobileThirdRowTransform}px`, // Position below third row, accounting for transforms
          transform: `translateY(-${mobileFourthRowTransform}px)`,
        }}
      >
        <div className="max-w-7xl mx-auto h-full pl-2 pr-6 flex items-center">
          <HeaderStoreLocation />
        </div>
      </div>
    </>
  );
};

export default GlobalHeader;
