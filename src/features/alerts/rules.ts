import { CurrentEnv } from "@/types/domain";

export type AlertSeverity = "warning" | "danger";

export type AppAlert = {
  id: string;
  metric: string;
  condition: string;
  title: string;
  value: number;
  unit?: string;
  severity: AlertSeverity;
};

type AlertRule = {
  id: string;
  metric: string;
  condition: string;
  title: string;
  value: (env: CurrentEnv) => number;
  unit?: string;
  severity: AlertSeverity;
  active: (env: CurrentEnv) => boolean;
};

const rules: AlertRule[] = [
  {
    id: "aqi100",
    metric: "AQI",
    condition: "AQI > 100",
    title: "Chất lượng không khí không tốt!",
    value: (env) => env.aqi,
    severity: "warning",
    active: (env) => env.aqi > 100,
  },
  {
    id: "aqi200",
    metric: "AQI",
    condition: "AQI > 200",
    title: "Chất lượng không khí rất xấu, hạn chế ra ngoài!",
    value: (env) => env.aqi,
    severity: "danger",
    active: (env) => env.aqi > 200,
  },
  {
    id: "preAqi100",
    metric: "AQI dự đoán",
    condition: "AQI dự đoán > 100",
    title: "Chất lượng không khí không tốt!",
    value: (env) => env.predictedAqi,
    severity: "warning",
    active: (env) => env.predictedAqi > 100,
  },
  {
    id: "preAqi200",
    metric: "AQI dự đoán",
    condition: "AQI dự đoán > 200",
    title: "Chất lượng không khí rất xấu, hạn chế ra ngoài!",
    value: (env) => env.predictedAqi,
    severity: "danger",
    active: (env) => env.predictedAqi > 200,
  },
  {
    id: "temperatureHigh",
    metric: "Nhiệt độ",
    condition: "Temperature > 35°C",
    title: "Nhiệt độ tăng cao, chú ý khi ra đường!",
    value: (env) => env.temperatureC,
    unit: "°C",
    severity: "warning",
    active: (env) => env.temperatureC > 35,
  },
  {
    id: "temperatureLow",
    metric: "Nhiệt độ",
    condition: "Temperature < 10°C",
    title: "Nhiệt độ thấp, hãy mặc ấm khi ra đường!",
    value: (env) => env.temperatureC,
    unit: "°C",
    severity: "warning",
    active: (env) => env.temperatureC < 10,
  },
  {
    id: "pm25",
    metric: "PM2.5",
    condition: "PM2.5 > 50",
    title: "Nồng độ PM2.5 cao!",
    value: (env) => env.pm25,
    unit: "µg/m³",
    severity: "warning",
    active: (env) => env.pm25 > 50,
  },
  {
    id: "pm10",
    metric: "PM10",
    condition: "PM10 > 100",
    title: "Nồng độ PM10 cao!",
    value: (env) => env.pm10,
    unit: "µg/m³",
    severity: "warning",
    active: (env) => env.pm10 > 100,
  },
  {
    id: "humidityLow",
    metric: "Độ ẩm",
    condition: "Humidity < 30%",
    title: "Độ ẩm thấp, hãy cẩn thận!",
    value: (env) => env.humidity,
    unit: "%",
    severity: "warning",
    active: (env) => env.humidity < 30,
  },
  {
    id: "co",
    metric: "CO",
    condition: "CO > 1000 ppm",
    title: "Nồng độ CO cao, có thể nguy hiểm nếu hít phải nhiều!",
    value: (env) => env.co,
    unit: "ppm",
    severity: "danger",
    active: (env) => env.co > 1000,
  },
  {
    id: "uv8",
    metric: "Chỉ số UV",
    condition: "UV Index > 8",
    title: "Chỉ số UV cao, hãy che chắn và dùng kem chống nắng khi ra đường!",
    value: (env) => env.uvIndex,
    severity: "warning",
    active: (env) => env.uvIndex > 8,
  },
  {
    id: "uv11",
    metric: "Chỉ số UV",
    condition: "UV Index > 11",
    title: "Chỉ số UV cực cao, hạn chế ra ngoài để tránh tổn thương da!",
    value: (env) => env.uvIndex,
    severity: "danger",
    active: (env) => env.uvIndex > 11,
  },
];

export function getActiveAlerts(env: CurrentEnv): AppAlert[] {
  return rules
    .filter((rule) => rule.active(env))
    .map((rule) => ({
      id: rule.id,
      metric: rule.metric,
      condition: rule.condition,
      title: rule.title,
      value: rule.value(env),
      unit: rule.unit,
      severity: rule.severity,
    }));
}
