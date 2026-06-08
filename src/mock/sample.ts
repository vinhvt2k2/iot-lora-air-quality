import { CurrentEnv, HourPoint } from "@/types/domain";

export const mockCurrent: CurrentEnv = {
  city: "location1",
  locationId: "location1",
  updatedAt: new Date().toISOString(),
  temperatureC: 30.3,
  humidity: 66.2,
  uvIndex: 2.45,
  aqi: 59,
  pm25: 29.3,
  pm10: 38.1,
  co: 72.23,
  predictedAqi: 60,
};

export const mockHours: HourPoint[] = Array.from({ length: 12 }).map((_, i) => {
  const d = new Date();
  d.setHours(d.getHours() - (11 - i));
  return {
    hourISO: d.toISOString(),
    aqi: 40 + i * 3,
    pm25: 20 + i * 1.2,
    pm10: 30 + i * 1.0,
    co: 50 + i * 2.1,
    temperatureC: 28 + i * 0.2,
    humidity: 62 + i * 0.4,
    uvIndex: 1.8 + i * 0.15,
    predictedAqi: 42 + i * 3,
  };
});
