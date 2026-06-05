import { FIREBASE_DEFAULT_LOCATION } from "@/constants/firebase";
import { fetchLocationIds } from "@/services/firebaseRealtime";
import { useEffect, useState } from "react";

type FirebaseLocationsState = {
  locations: string[];
  loading: boolean;
  error?: string;
};

export function useFirebaseLocations(): FirebaseLocationsState {
  const [locations, setLocations] = useState<string[]>([
    FIREBASE_DEFAULT_LOCATION,
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const controller = new AbortController();

    const loadLocations = async () => {
      try {
        setError(undefined);
        const nextLocations = await fetchLocationIds(controller.signal);
        setLocations(nextLocations);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Cannot load Firebase locations"
        );
      } finally {
        setLoading(false);
      }
    };

    void loadLocations();

    return () => {
      controller.abort();
    };
  }, []);

  return { locations, loading, error };
}
