import React from "react";

interface HamburgerMenuProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
  size?: "small" | "medium" | "large";
  color?: string;
  ariaLabel?: string;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  isOpen,
  onClick,
  className = "",
  size = "medium",
  color = "currentColor",
  ariaLabel = "Toggle menu",
}) => {
  // Size configurations
  const sizeClasses = {
    small: "w-5 h-5",
    medium: "w-6 h-6",
    large: "w-8 h-8",
  };

  const lineHeight = {
    small: "h-0.5",
    medium: "h-0.5",
    large: "h-1",
  };

  return (
    <button
      onClick={onClick}
      className={`flex flex-col justify-center items-center p-2 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-md transition-colors hover:bg-gray-100 ${className}`}
      aria-label={ariaLabel}
      aria-expanded={isOpen}
      type="button"
    >
      <div className={`${sizeClasses[size]} flex flex-col justify-between`}>
        {/* Top line */}
        <span
          className={`${lineHeight[size]} w-full bg-current rounded-sm transform transition-all duration-300 ease-in-out origin-center ${
            isOpen ? "rotate-45 translate-y-1.5" : ""
          }`}
          style={{ color }}
        />
        
        {/* Middle line */}
        <span
          className={`${lineHeight[size]} w-full bg-current rounded-sm transition-all duration-300 ease-in-out ${
            isOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
          }`}
          style={{ color }}
        />
        
        {/* Bottom line */}
        <span
          className={`${lineHeight[size]} w-full bg-current rounded-sm transform transition-all duration-300 ease-in-out origin-center ${
            isOpen ? "-rotate-45 -translate-y-1.5" : ""
          }`}
          style={{ color }}
        />
      </div>
    </button>
  );
};

export default HamburgerMenu;
