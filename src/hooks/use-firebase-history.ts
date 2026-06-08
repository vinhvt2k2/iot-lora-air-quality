import {
  FIREBASE_DEFAULT_LOCATION,
  FIREBASE_REFRESH_MS,
} from "@/constants/firebase";
import { fetchRecentHistory } from "@/services/firebaseRealtime";
import { HourPoint } from "@/types/domain";
import { useCallback, useEffect, useState } from "react";

type FirebaseHistoryState = {
  data: HourPoint[];
  loading: boolean;
  error?: string;
  refresh: () => Promise<void>;
};

export function useFirebaseHistory(
  locationId = FIREBASE_DEFAULT_LOCATION,
  limit = 12
): FirebaseHistoryState {
  const [data, setData] = useState<HourPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const refresh = useCallback(async () => {
    const controller = new AbortController();

    try {
      setLoading(true);
      setError(undefined);
      const nextData = await fetchRecentHistory(
        locationId,
        limit,
        controller.signal
      );
      setData(nextData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cannot load Firebase history");
    } finally {
      setLoading(false);
    }
  }, [limit, locationId]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (active) {
        await refresh();
      }
    };

    void load();
    const timer = setInterval(load, FIREBASE_REFRESH_MS);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [refresh]);

  return { data, loading, error, refresh };
}
