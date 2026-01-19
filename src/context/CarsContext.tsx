import React, { createContext, useContext } from "react";
import type { Car } from "../lib/storage";

export type CarsContextValue = {
  cars: Car[];
  activeIndex: number;
  setActiveIndex: (i: number) => void;
};

const CarsContext = createContext<CarsContextValue | undefined>(undefined);

type CarsProviderProps = CarsContextValue & {
  children: React.ReactNode;
};

export function CarsProvider({ cars, activeIndex, setActiveIndex, children }: CarsProviderProps) {
  return (
    <CarsContext.Provider value={{ cars, activeIndex, setActiveIndex }}>
      {children}
    </CarsContext.Provider>
  );
}

export function useCars(): CarsContextValue {
  const ctx = useContext(CarsContext);
  if (!ctx) {
    throw new Error("useCars muss innerhalb eines <CarsProvider> verwendet werden.");
  }
  return ctx;
}
