import { FIREBASE_DEFAULT_LOCATION } from "@/constants/firebase";
import React, { createContext, useContext, useMemo, useState } from "react";

type LocationContextValue = {
  selectedLocation: string;
  setSelectedLocation: (locationId: string) => void;
};

const LocationContext = createContext<LocationContextValue | undefined>(
  undefined
);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [selectedLocation, setSelectedLocation] = useState(
    FIREBASE_DEFAULT_LOCATION
  );

  const value = useMemo(
    () => ({ selectedLocation, setSelectedLocation }),
    [selectedLocation]
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useSelectedLocation() {
  const value = useContext(LocationContext);

  if (!value) {
    throw new Error("useSelectedLocation must be used inside LocationProvider");
  }

  return value;
}
