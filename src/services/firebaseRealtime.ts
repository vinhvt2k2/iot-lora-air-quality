import {
  FIREBASE_DATABASE_URL,
  FIREBASE_DEFAULT_LOCATION,
} from "@/constants/firebase";
import { CurrentEnv, HourPoint } from "@/types/domain";

type FirebaseLocationRaw = {
  AQI?: unknown;
  CO?: unknown;
  PM10?: unknown;
  PM25?: unknown;
  PreAQI?: unknown;
  humidity?: unknown;
  temperature?: unknown;
  uvIndex?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
};

const toNumber = (value: unknown, fallback = 0) => {
  const parsed =
    typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));

  return Number.isFinite(parsed) ? parsed : fallback;
};

const toIsoTime = (value: unknown, fallback = new Date().toISOString()) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return new Date(value).toISOString();
  }

  if (typeof value === "string") {
    const numericValue = Number(value);
    if (Number.isFinite(numericValue) && value.trim() !== "") {
      return new Date(numericValue).toISOString();
    }

    const parsedDate = new Date(value);
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.toISOString();
    }
  }

  return fallback;
};

const mapCurrentEnv = (
  raw: FirebaseLocationRaw,
  locationId: string,
  fallbackTime = new Date().toISOString()
): CurrentEnv => ({
  city: getLocationTitle(locationId),
  locationId,
  updatedAt: toIsoTime(raw.updatedAt ?? raw.createdAt, fallbackTime),
  temperatureC: toNumber(raw.temperature),
  humidity: toNumber(raw.humidity),
  uvIndex: toNumber(raw.uvIndex),
  aqi: toNumber(raw.AQI),
  pm25: toNumber(raw.PM25),
  pm10: toNumber(raw.PM10),
  co: toNumber(raw.CO),
  predictedAqi: toNumber(raw.PreAQI),
});

const mapHourPoint = (
  raw: FirebaseLocationRaw,
  key: string,
  fallbackTime = new Date().toISOString()
): HourPoint => ({
  hourISO: toIsoTime(raw.createdAt ?? raw.updatedAt ?? key, fallbackTime),
  aqi: toNumber(raw.AQI),
  pm25: toNumber(raw.PM25),
  pm10: toNumber(raw.PM10),
  co: toNumber(raw.CO),
  temperatureC: toNumber(raw.temperature),
  humidity: toNumber(raw.humidity),
  uvIndex: toNumber(raw.uvIndex),
  predictedAqi: toNumber(raw.PreAQI),
});

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
  const url = `${FIREBASE_DATABASE_URL}/smartcity/${locationId}/current.json`;
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Firebase request failed: ${response.status}`);
  }

  const raw = (await response.json()) as FirebaseLocationRaw | null;

  if (!raw) {
    throw new Error(`Firebase location not found: ${locationId}`);
  }

  return mapCurrentEnv(raw, locationId);
}

export async function fetchRecentHistory(
  locationId = FIREBASE_DEFAULT_LOCATION,
  limit = 12,
  signal?: AbortSignal
): Promise<HourPoint[]> {
  const orderByKey = encodeURIComponent('"$key"');
  const url = `${FIREBASE_DATABASE_URL}/smartcity/${locationId}/history.json?orderBy=${orderByKey}&limitToLast=${limit}`;
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Firebase history request failed: ${response.status}`);
  }

  const raw = (await response.json()) as Record<string, FirebaseLocationRaw> | null;

  if (!raw) {
    return [];
  }

  return Object.entries(raw)
    .map(([key, value]) => mapHourPoint(value, key))
    .sort(
      (first, second) =>
        new Date(first.hourISO).getTime() - new Date(second.hourISO).getTime()
    )
    .slice(-limit);
}
