'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export interface HeroData {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonHref?: string;
  image: string;
  onButtonClick?: () => void;
}

interface HeroProps {
  heroes: HeroData[];
  autoRotate?: boolean;
  rotationInterval?: number; // milliseconds
  className?: string;
}

export default function Hero({ 
  heroes, 
  autoRotate = false, 
  rotationInterval = 5000,
  className = ""
}: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoRotate || heroes.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroes.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [autoRotate, heroes.length, rotationInterval]);

  if (heroes.length === 0) {
    return null;
  }

  const currentHero = heroes[currentIndex];

  const handleButtonClick = () => {
    if (currentHero.onButtonClick) {
      currentHero.onButtonClick();
    } else if (currentHero.buttonHref) {
      window.location.href = currentHero.buttonHref;
    }
  };

  return (
    <div className={`hero min-h-[400px] bg-base-100 ${className}`}>
      <div className="hero-content flex-col lg:flex-row-reverse w-full max-w-6xl">
        {/* Right Column - Image (60% width) */}
        <div className="flex-[0_0_60%] w-full">
          <Image
            src={currentHero.image}
            alt={currentHero.title}
            width={600}
            height={400}
            className="w-full h-[300px] lg:h-[400px] object-cover rounded-lg shadow-lg"
            priority={currentIndex === 0}
          />
        </div>
        
        {/* Left Column - Content (40% width) */}
        <div className="flex-[0_0_40%] w-full pr-0 lg:pr-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-base-content leading-tight">
            {currentHero.title}
          </h1>
          <p className="text-lg lg:text-xl text-base-content/80 py-6 leading-relaxed">
            {currentHero.subtitle}
          </p>
          <button 
            className="btn btn-primary btn-lg text-lg px-8"
            onClick={handleButtonClick}
          >
            {currentHero.buttonText}
          </button>
        </div>
      </div>

      {/* Navigation Dots (if multiple heroes) */}
      {heroes.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-2">
            {heroes.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentIndex 
                    ? 'bg-primary' 
                    : 'bg-base-300 hover:bg-base-content/30'
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to hero ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
