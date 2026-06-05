// src/features/aqi/aqiLevels.ts

export type AQILevelKey =
  | "good"
  | "moderate"
  | "unhealthy_sensitive"
  | "unhealthy"
  | "very_unhealthy"
  | "hazardous";

export const aqiToLevel = (aqi?: number | null): AQILevelKey => {
  if (aqi == null || Number.isNaN(aqi)) return "good";
  if (aqi <= 50) return "good";
  if (aqi <= 100) return "moderate";
  if (aqi <= 150) return "unhealthy_sensitive";
  if (aqi <= 200) return "unhealthy";
  if (aqi <= 300) return "very_unhealthy";
  return "hazardous";
};

export const levelMeta: Record<
  AQILevelKey,
  { label: string; range: string; advice: string; color: string }
> = {
  good: {
    label: "Tốt",
    range: "0–50",
    advice: "Chất lượng không khí tốt.",
    color: "#2ecc71",
  },
  moderate: {
    label: "Trung bình",
    range: "51–100",
    advice: "Chấp nhận được, người nhạy cảm nên chú ý.",
    color: "#f1c40f",
  },
  unhealthy_sensitive: {
    label: "Kém (nhạy cảm)",
    range: "101–150",
    advice: "Nhóm nhạy cảm nên hạn chế hoạt động ngoài trời.",
    color: "#e67e22",
  },
  unhealthy: {
    label: "Xấu",
    range: "151–200",
    advice: "Hạn chế ra ngoài, cân nhắc đeo khẩu trang lọc bụi.",
    color: "#e74c3c",
  },
  very_unhealthy: {
    label: "Rất xấu",
    range: "201–300",
    advice: "Tránh hoạt động ngoài trời, ưu tiên ở trong nhà.",
    color: "#9b59b6",
  },
  hazardous: {
    label: "Nguy hại",
    range: "300+",
    advice: "Hạn chế ra ngoài tối đa, theo dõi khuyến cáo y tế.",
    color: "#7f1d1d",
  },
};
