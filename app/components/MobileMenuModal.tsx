'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MyAccountIcon from './MyAccountIcon';
import HelpIcon from './HelpIcon';
import TrackOrderIcon from './TrackOrderIcon';
import { useMyAccountUI } from '../my-account-ui-context';
import { CategoryTree, getCategoryTree } from '../models/category';

interface MobileMenuModalProps {
  open: boolean;
  onClose: () => void;
}

interface CategoryDrillDownState {
  level: number;
  parentCategory?: CategoryTree;
  categories: CategoryTree[];
  title: string;
}

const MobileMenuModal: React.FC<MobileMenuModalProps> = ({ 
  open, 
  onClose
}) => {
  const { openMyAccount } = useMyAccountUI();
  const router = useRouter();
  const [drillDownStack, setDrillDownStack] = useState<CategoryDrillDownState[]>([]);
  const [categoryTree, setCategoryTree] = useState<CategoryTree[]>([]);

  // Initialize category tree
  useEffect(() => {
    const tree = getCategoryTree();
    setCategoryTree(tree);
  }, []);

  const handleBack = () => {
    setDrillDownStack(drillDownStack.slice(0, -1));
  };

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (drillDownStack.length > 0) {
          // Go back one level if in drill-down
          handleBack();
        } else {
          onClose();
        }
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
  }, [open, onClose, drillDownStack, handleBack]);

  // Reset drill-down state when modal closes
  useEffect(() => {
    if (!open) {
      setDrillDownStack([]);
    }
  }, [open]);

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

  const handleCategoryDrillDown = (category: CategoryTree) => {
    if (category.children && category.children.length > 0) {
      // Drill down to show children
      const newState: CategoryDrillDownState = {
        level: drillDownStack.length + 1,
        parentCategory: category,
        categories: category.children,
        title: category.name
      };
      setDrillDownStack([...drillDownStack, newState]);
    } else {
      // Navigate to category page
      onClose();
      router.push(`/c/${category.slug}`);
    }
  };

  const handleClose = () => {
    setDrillDownStack([]);
    onClose();
  };

  const currentDrillDown = drillDownStack[drillDownStack.length - 1];
  const isInDrillDown = drillDownStack.length > 0;
  const currentCategories = isInDrillDown ? currentDrillDown.categories : categoryTree;

  return (
    <div 
      className="fixed inset-0 z-[1000] bg-black bg-opacity-30 flex justify-center"
      onClick={handleClose}
    >
      <div 
        className="bg-white w-full h-full flex flex-col overflow-y-auto animate-slide-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-200">
          <button
            onClick={isInDrillDown ? handleBack : handleClose}
            className="text-gray-400 hover:text-gray-600 p-2 mr-4"
            aria-label={isInDrillDown ? "Go back" : "Close menu"}
          >
            {isInDrillDown ? (
              // Back arrow
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            ) : (
              // Close X
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
          <div className="flex-1 text-center">
            <h2 id="mobile-menu-title" className="text-lg font-semibold text-gray-900">
              {isInDrillDown ? currentDrillDown.title : 'Menu'}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          {!isInDrillDown && (
            <>
              {/* Main Menu Items - Only show on main menu */}
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
            </>
          )}

          {/* Categories Section */}
          {currentCategories.length > 0 && (
            <div>
              {!isInDrillDown && (
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-4">
                    Categories
                  </h3>
                </div>
              )}
              <div className="space-y-1">
                {currentCategories.map((category) => {
                  const hasChildren = category.children && category.children.length > 0;
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryDrillDown(category)}
                      className="block w-full text-left p-4 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <span className="text-base text-gray-900">{category.name}</span>
                          {category.description && (
                            <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                          )}
                        </div>
                        {hasChildren && (
                          <div className="ml-4 flex-shrink-0">
                            <svg 
                              className="w-5 h-5 text-gray-400" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Marketing Column - Show at deepest level */}
          {isInDrillDown && currentDrillDown.level >= 2 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-4">
                  Featured
                </h3>
              </div>
              <div className="space-y-1">
                <Link
                  href="/new-releases"
                  onClick={handleClose}
                  className="block w-full text-left p-4 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="text-base text-gray-900">New Releases</span>
                  <p className="text-sm text-gray-500 mt-1">Latest products and innovations</p>
                </Link>
                <Link
                  href="/best-sellers"
                  onClick={handleClose}
                  className="block w-full text-left p-4 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="text-base text-gray-900">Best Sellers</span>
                  <p className="text-sm text-gray-500 mt-1">Most popular items</p>
                </Link>
                <Link
                  href="/deals"
                  onClick={handleClose}
                  className="block w-full text-left p-4 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="text-base text-gray-900">Special Deals</span>
                  <p className="text-sm text-gray-500 mt-1">Limited time offers</p>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenuModal;
