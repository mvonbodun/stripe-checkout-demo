'use client';

import './globals.css';
import Link from 'next/link';
import { CartProvider } from './cart-context';
import MiniCart from './components/MiniCart';
import GlobalHeader from './components/GlobalHeader';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const pathname = usePathname();
  const isCheckoutPage = pathname === '/checkout' || pathname === '/order-confirmation';

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <CartProvider>
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
              <GlobalHeader onCartClick={() => setIsMiniCartOpen(true)} />
              <MiniCart open={isMiniCartOpen} onClose={() => setIsMiniCartOpen(false)} />
            </>
          )}
          <main className={`flex-1 ${isCheckoutPage ? '' : 'mt-[204px] md:mt-[148px]'}`}>
            {children}
          </main>
          <footer className="bg-gray-50 border-t px-6 py-4 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Stripe Checkout Demo. All rights reserved.
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
