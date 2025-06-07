import React from "react";

interface TrackOrderIconProps {
  onClick?: () => void;
  className?: string;
  asButton?: boolean; // When false, renders only the SVG without button wrapper
}

const TrackOrderIcon: React.FC<TrackOrderIconProps> = ({
  onClick = () => {},
  className = "",
  asButton = true,
}) => {
  const iconSvg = (
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
        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
      />
    </svg>
  );

  if (!asButton) {
    return <div className={`text-gray-600 ${className}`}>{iconSvg}</div>;
  }

  return (
    <button
      className={`text-gray-600 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1 ${className}`}
      aria-label="Track your order"
      onClick={onClick}
    >
      {iconSvg}
    </button>
  );
};

export default TrackOrderIcon;
