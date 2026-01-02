"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type Currency = "EUR" | "USD" | "GBP" | "MAD";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convert: (eurAmount: number) => number;
  symbol: string;
  code: string;
  formatPrice: (eurAmount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Exchange rates relative to EUR (update periodically or fetch from API)
const EXCHANGE_RATES: Record<Currency, number> = {
  EUR: 1,
  USD: 1.05,
  GBP: 0.84,
  MAD: 10.80,
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
  MAD: "DH",
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("EUR");

  // Persist currency preference
  useEffect(() => {
    const saved = localStorage.getItem("currency") as Currency;
    if (saved && EXCHANGE_RATES[saved]) {
      setCurrency(saved);
    }
  }, []);

  const handleSetCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    localStorage.setItem("currency", newCurrency);
  };

  const convert = (eurAmount: number): number => {
    const rate = EXCHANGE_RATES[currency];
    return Math.round(eurAmount * rate);
  };

  const formatPrice = (eurAmount: number): string => {
    const converted = convert(eurAmount);
    const symbol = CURRENCY_SYMBOLS[currency];
    
    // MAD typically shown after the number
    if (currency === "MAD") {
      return `${converted} ${symbol}`;
    }
    return `${symbol}${converted}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency: handleSetCurrency,
        convert,
        symbol: CURRENCY_SYMBOLS[currency],
        code: currency,
        formatPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
