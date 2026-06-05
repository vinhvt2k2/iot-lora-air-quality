import {
  FIREBASE_DEFAULT_LOCATION,
  FIREBASE_REFRESH_MS,
} from "@/constants/firebase";
import { fetchCurrentEnv } from "@/services/firebaseRealtime";
import { CurrentEnv } from "@/types/domain";
import { useCallback, useEffect, useState } from "react";

type CurrentEnvState = {
  data?: CurrentEnv;
  loading: boolean;
  error?: string;
  refresh: () => Promise<void>;
};

export function useFirebaseCurrentEnv(
  locationId = FIREBASE_DEFAULT_LOCATION
): CurrentEnvState {
  const [data, setData] = useState<CurrentEnv>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const refresh = useCallback(async () => {
    const controller = new AbortController();

    try {
      setLoading(true);
      setError(undefined);
      const nextData = await fetchCurrentEnv(locationId, controller.signal);
      setData(nextData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cannot load Firebase data");
    } finally {
      setLoading(false);
    }
  }, [locationId]);

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
