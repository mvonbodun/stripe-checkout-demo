"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface MiniCartUIContextType {
  isMiniCartOpen: boolean;
  openMiniCart: () => void;
  closeMiniCart: () => void;
}

const MiniCartUIContext = createContext<MiniCartUIContextType | undefined>(undefined);

export function MiniCartUIProvider({ children }: { children: ReactNode }) {
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);

  const openMiniCart = () => setIsMiniCartOpen(true);
  const closeMiniCart = () => setIsMiniCartOpen(false);

  return (
    <MiniCartUIContext.Provider value={{ isMiniCartOpen, openMiniCart, closeMiniCart }}>
      {children}
    </MiniCartUIContext.Provider>
  );
}

export function useMiniCartUI() {
  const context = useContext(MiniCartUIContext);
  if (!context) {
    throw new Error("useMiniCartUI must be used within a MiniCartUIProvider");
  }
  return context;
}
