"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface MyAccountUIContextType {
  isMyAccountOpen: boolean;
  openMyAccount: () => void;
  closeMyAccount: () => void;
}

const MyAccountUIContext = createContext<MyAccountUIContextType | undefined>(undefined);

export function MyAccountUIProvider({ children }: { children: ReactNode }) {
  const [isMyAccountOpen, setIsMyAccountOpen] = useState(false);

  const openMyAccount = () => setIsMyAccountOpen(true);
  const closeMyAccount = () => setIsMyAccountOpen(false);

  return (
    <MyAccountUIContext.Provider value={{ isMyAccountOpen, openMyAccount, closeMyAccount }}>
      {children}
    </MyAccountUIContext.Provider>
  );
}

export function useMyAccountUI() {
  const context = useContext(MyAccountUIContext);
  if (!context) {
    throw new Error("useMyAccountUI must be used within a MyAccountUIProvider");
  }
  return context;
}
