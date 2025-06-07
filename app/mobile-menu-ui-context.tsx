'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Context for mobile menu UI state
interface MobileMenuUIContextType {
  isMobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
}

const MobileMenuUIContext = createContext<MobileMenuUIContextType | undefined>(undefined);

export function useMobileMenuUI() {
  const context = useContext(MobileMenuUIContext);
  if (context === undefined) {
    throw new Error('useMobileMenuUI must be used within a MobileMenuUIProvider');
  }
  return context;
}

interface MobileMenuUIProviderProps {
  children: ReactNode;
}

export function MobileMenuUIProvider({ children }: MobileMenuUIProviderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openMobileMenu = () => setIsMobileMenuOpen(true);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const value: MobileMenuUIContextType = {
    isMobileMenuOpen,
    openMobileMenu,
    closeMobileMenu,
  };

  return (
    <MobileMenuUIContext.Provider value={value}>
      {children}
    </MobileMenuUIContext.Provider>
  );
}
