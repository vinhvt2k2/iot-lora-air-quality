export type AQILevelKey =
  | "good"
  | "moderate"
  | "unhealthy_sg"
  | "unhealthy"
  | "very_unhealthy"
  | "hazardous";

export type CurrentEnv = {
  city: string;
  locationId?: string;
  updatedAt: string; // ISO
  temperatureC: number;
  humidity: number;
  uvIndex: number;

  aqi: number; // AQI tổng hợp
  pm25: number; // µg/m3
  pm10: number; // µg/m3
  co: number; // µg/m3 (theo dữ liệu bạn đang dùng)
  predictedAqi: number;
};

export type HourPoint = {
  hourISO: string; // ISO time
  aqi: number;
  pm25: number;
  pm10: number;
  co: number;
};
