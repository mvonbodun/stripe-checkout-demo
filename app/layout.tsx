'use client';

import './globals.css';
import Link from 'next/link';
import { CartProvider } from './cart-context';
import MiniCart from './components/MiniCart';
import { MiniCartUIProvider, useMiniCartUI } from './mini-cart-ui-context';
import { MyAccountUIProvider, useMyAccountUI } from './my-account-ui-context';
import { MobileMenuUIProvider, useMobileMenuUI } from './mobile-menu-ui-context';
import { CategoriesProvider, useCategories } from './categories-context';
import MyAccountModal from './components/MyAccountModal';
import MobileMenuModal from './components/MobileMenuModal';
import GlobalHeader from './components/GlobalHeader';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';

function MiniCartWithContext() {
  const { isMiniCartOpen, closeMiniCart } = useMiniCartUI();
  return <MiniCart open={isMiniCartOpen} onClose={closeMiniCart} />;
}

function MyAccountModalWithContext() {
  const { isMyAccountOpen, closeMyAccount } = useMyAccountUI();
  return <MyAccountModal open={isMyAccountOpen} onClose={closeMyAccount} />;
}

function MobileMenuModalWithContext() {
  const { isMobileMenuOpen, closeMobileMenu } = useMobileMenuUI();
  const { categories } = useCategories();
  return <MobileMenuModal open={isMobileMenuOpen} onClose={closeMobileMenu} categories={categories} />;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mobileHeaderProgress, setMobileHeaderProgress] = useState(0);
  const pathname = usePathname();
  const isCheckoutPage = pathname === '/checkout' || pathname === '/order-confirmation';

  // Calculate dynamic mobile margin based on header hide progress
  const calculateMobileMargin = () => {
    const baseMobileMargin = 204; // Base mobile margin in px
    const adjustedMargin = baseMobileMargin * (1 - mobileHeaderProgress);
    return `${adjustedMargin}px`;
  };

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <CartProvider>
          <CategoriesProvider>
            <MiniCartUIProvider>
              <MyAccountUIProvider>
                <MobileMenuUIProvider>
              {isCheckoutPage ? (
                // Checkout and order-confirmation header - centered text only
                <header className="bg-white border-b px-6 py-4 shadow-sm">
                  <div className="max-w-7xl mx-auto flex items-center justify-center">
                    <Link 
                      href="/" 
                      className="font-bold text-xl text-gray-800 no-underline hover:no-underline focus:no-underline active:no-underline hover:text-gray-600 transition-colors"
                    >
                      Stripe Checkout Demo
                    </Link>
                  </div>
                </header>
              ) : (
                // Enhanced global header with three sections
                <>
                  <GlobalHeader 
                    onMobileHeaderProgressChange={setMobileHeaderProgress}
                  />
                  <MiniCartWithContext />
                  <MyAccountModalWithContext />
                  <MobileMenuModalWithContext />
                </>
              )}
              <main 
                className={`flex-1 ${isCheckoutPage ? '' : 'md:mt-[128px]'}`}
                style={!isCheckoutPage ? { marginTop: calculateMobileMargin() } : {}}
              >
                {children}
              </main>
              <footer className="bg-gray-50 border-t px-6 py-4 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} Stripe Checkout Demo. All rights reserved.
              </footer>
                </MobileMenuUIProvider>
              </MyAccountUIProvider>
            </MiniCartUIProvider>
          </CategoriesProvider>
        </CartProvider>
      </body>
    </html>
  );
}
