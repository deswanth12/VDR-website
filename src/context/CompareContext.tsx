// src/context/CompareContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProductItem, DEMO_PRODUCTS } from '@/data/catalogue';

interface CompareContextType {
  compareItems: ProductItem[];
  addToCompare: (product: ProductItem) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
  isLoaded: boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  // Always initialize identically on SSR and initial client hydration to prevent hydration mismatch
  const [compareItems, setCompareItems] = useState<ProductItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Restore saved comparison list from sessionStorage only after client-side mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('vdr_compare_items');
      if (saved) {
        const ids: string[] = JSON.parse(saved);
        setCompareItems(DEMO_PRODUCTS.filter((p) => ids.includes(p.id)));
      }
    } catch {
      // Ignore storage errors in private browsing
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Persist compare list to session only after initial load has completed
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const ids = compareItems.map((p) => p.id);
      sessionStorage.setItem('vdr_compare_items', JSON.stringify(ids));
    } catch {
      // Ignore storage errors
    }
  }, [compareItems, isLoaded]);

  const addToCompare = (product: ProductItem) => {
    if (compareItems.some((item) => item.id === product.id)) return;
    if (compareItems.length >= 3) {
      alert('You can compare up to 3 products at a time.');
      return;
    }
    setCompareItems((prev) => [...prev, product]);
  };

  const removeFromCompare = (productId: string) => {
    setCompareItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const isInCompare = (productId: string) => {
    return compareItems.some((item) => item.id === productId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        isLoaded,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
