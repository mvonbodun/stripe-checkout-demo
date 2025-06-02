import React from "react";

interface HeaderSearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
}

const HeaderSearchBar: React.FC<HeaderSearchBarProps> = ({
  placeholder = "Search products...",
  className = "",
  onSearch,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className={`flex-grow ${className.includes('mx-0') ? '' : 'mx-6'} ${className}`}>
      <div className={`relative ${className.includes('mx-0') ? 'w-full' : 'max-w-md mx-auto'}`}>
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
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
        </div>
        <input
          type="search"
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
          onChange={handleInputChange}
          aria-label="Search products"
        />
      </div>
    </div>
  );
};

export default HeaderSearchBar;
