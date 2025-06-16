'use client';
import { useState } from 'react';

interface QuantitySelectorProps {
  initialQuantity?: number;
  min?: number;
  max?: number;
  onChange?: (quantity: number) => void;
  className?: string;
}

export default function QuantitySelector({ 
  initialQuantity = 1, 
  min = 1, 
  max = 99,
  onChange,
  className = ""
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const updateQuantity = (newQuantity: number) => {
    const clampedQuantity = Math.max(min, Math.min(max, newQuantity));
    setQuantity(clampedQuantity);
    onChange?.(clampedQuantity);
  };

  return (
    <div className={`flex items-center border border-gray-300 rounded-md ${className}`}>
      <button
        onClick={() => updateQuantity(quantity - 1)}
        disabled={quantity <= min}
        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Decrease quantity"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
      
      <input
        type="number"
        value={quantity}
        onChange={(e) => updateQuantity(parseInt(e.target.value) || min)}
        min={min}
        max={max}
        className="w-16 text-center border-0 focus:ring-0 focus:outline-none"
        aria-label="Quantity"
      />
      
      <button
        onClick={() => updateQuantity(quantity + 1)}
        disabled={quantity >= max}
        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Increase quantity"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </div>
  );
}
