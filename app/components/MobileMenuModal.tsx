'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MyAccountIcon from './MyAccountIcon';
import HelpIcon from './HelpIcon';
import TrackOrderIcon from './TrackOrderIcon';
import { useMyAccountUI } from '../my-account-ui-context';
import { CatalogCategory } from '../api/catalog-categories/route';

interface MobileMenuModalProps {
  open: boolean;
  onClose: () => void;
  categories?: CatalogCategory[];
}

const MobileMenuModal: React.FC<MobileMenuModalProps> = ({ 
  open, 
  onClose, 
  categories = [] 
}) => {
  const { openMyAccount } = useMyAccountUI();
  const router = useRouter();

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleMyAccountClick = () => {
    onClose(); // Close mobile menu first
    openMyAccount(); // Then open My Account modal
  };

  const handleTrackOrderClick = () => {
    onClose();
    router.push('/track-order');
  };

  const handleHelpClick = () => {
    onClose();
    router.push('/help');
  };

  return (
    <div 
      className="fixed inset-0 z-[1000] bg-black bg-opacity-30 flex justify-center"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full h-full flex flex-direction-column overflow-y-auto animate-slide-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-200">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 mr-4"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex-1 text-center">
            <h2 id="mobile-menu-title" className="text-lg font-semibold text-gray-900">
              Menu
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          {/* Main Menu Items */}
          <div className="space-y-1 mb-6">
            {/* My Account Row */}
            <button
              onClick={handleMyAccountClick}
              className="w-full flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <MyAccountIcon asButton={false} className="mr-4 flex-shrink-0" />
              <span className="text-base font-medium text-gray-900">My Account</span>
            </button>

            {/* Help Row */}
            <button
              onClick={handleHelpClick}
              className="w-full flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <HelpIcon asButton={false} className="mr-4 flex-shrink-0" />
              <span className="text-base font-medium text-gray-900">Get Help</span>
            </button>

            {/* Track Order Row */}
            <button
              onClick={handleTrackOrderClick}
              className="w-full flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <TrackOrderIcon asButton={false} className="mr-4 flex-shrink-0" />
              <span className="text-base font-medium text-gray-900">Track Your Order</span>
            </button>
          </div>

          {/* Categories Section */}
          {categories.length > 0 && (
            <div>
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-4">
                  Categories
                </h3>
              </div>
              <div className="space-y-1">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    onClick={onClose}
                    className="block w-full text-left p-4 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span className="text-base text-gray-900">{category.name}</span>
                    {category.description && (
                      <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenuModal;
