import {
  FIREBASE_DATABASE_URL,
  FIREBASE_DEFAULT_LOCATION,
} from "@/constants/firebase";
import { CurrentEnv } from "@/types/domain";

type FirebaseLocationRaw = {
  AQI?: unknown;
  CO?: unknown;
  PM10?: unknown;
  PM25?: unknown;
  PreAQI?: unknown;
  humidity?: unknown;
  temperature?: unknown;
  uvIndex?: unknown;
};

const toNumber = (value: unknown, fallback = 0) => {
  const parsed =
    typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));

  return Number.isFinite(parsed) ? parsed : fallback;
};

export const getLocationTitle = (locationId: string) => locationId;

export async function fetchLocationIds(signal?: AbortSignal): Promise<string[]> {
  const url = `${FIREBASE_DATABASE_URL}/smartcity.json?shallow=true`;
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Firebase locations request failed: ${response.status}`);
  }

  const raw = (await response.json()) as Record<string, true> | null;
  const locations = raw ? Object.keys(raw).sort() : [];

  return locations.length > 0 ? locations : [FIREBASE_DEFAULT_LOCATION];
}

export async function fetchCurrentEnv(
  locationId = FIREBASE_DEFAULT_LOCATION,
  signal?: AbortSignal
): Promise<CurrentEnv> {
  const url = `${FIREBASE_DATABASE_URL}/smartcity/${locationId}.json`;
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Firebase request failed: ${response.status}`);
  }

  const raw = (await response.json()) as FirebaseLocationRaw | null;

  if (!raw) {
    throw new Error(`Firebase location not found: ${locationId}`);
  }

  return {
    city: getLocationTitle(locationId),
    locationId,
    updatedAt: new Date().toISOString(),
    temperatureC: toNumber(raw.temperature),
    humidity: toNumber(raw.humidity),
    uvIndex: toNumber(raw.uvIndex),
    aqi: toNumber(raw.AQI),
    pm25: toNumber(raw.PM25),
    pm10: toNumber(raw.PM10),
    co: toNumber(raw.CO),
    predictedAqi: toNumber(raw.PreAQI),
  };
}
