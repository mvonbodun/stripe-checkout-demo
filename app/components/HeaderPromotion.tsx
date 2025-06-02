"use client";

import React from "react";
import { PromotionalOffer } from "../api/promotional-offers/route";

interface HeaderPromotionProps {
  offers: PromotionalOffer[];
  currentOfferIndex: number;
  isLoading: boolean;
  onOfferChange: (index: number) => void;
  transform: number;
}

const HeaderPromotion: React.FC<HeaderPromotionProps> = ({
  offers,
  currentOfferIndex,
  isLoading,
  onOfferChange,
  transform,
}) => {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden transition-transform duration-300 ease-out"
      style={{
        height: "44px", // Fixed height to prevent layout shift
        transform: `translateY(-${transform}px)`,
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
                    onClick={() => onOfferChange(index)}
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
  );
};

export default HeaderPromotion;
