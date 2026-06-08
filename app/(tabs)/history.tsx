import SimpleBarChart, {
  BarChartPoint,
} from "@/components/charts/SimpleBarChart";
import AppHeader from "@/components/common/AppHeader";
import Screen from "@/components/common/Screen";
import { COLORS } from "@/constants/colors";
import { useSelectedLocation } from "@/context/location-context";
import { useFirebaseHistory } from "@/hooks/use-firebase-history";
import { mockHours } from "@/mock/sample";
import { HourPoint } from "@/types/domain";
import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

const HISTORY_POINT_COUNT = 12;
const GATEWAY_INTERVAL_MS = 5 * 60 * 1000;

type HistorySlot = {
  label: string;
  point?: HourPoint;
};

const formatPointTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

const roundDownToGatewaySlot = (timeMs: number) =>
  Math.floor(timeMs / GATEWAY_INTERVAL_MS) * GATEWAY_INTERVAL_MS;

const buildHistorySlots = (
  points: HourPoint[],
  slotCount = HISTORY_POINT_COUNT
): HistorySlot[] => {
  const currentSlotTime = roundDownToGatewaySlot(Date.now());
  const firstSlotTime =
    currentSlotTime - (slotCount - 1) * GATEWAY_INTERVAL_MS;
  const pointsBySlot = new Map<number, HourPoint>();

  points.forEach((point) => {
    const pointTime = new Date(point.hourISO).getTime();
    if (!Number.isFinite(pointTime)) return;

    const pointSlotTime = roundDownToGatewaySlot(pointTime);
    if (pointSlotTime < firstSlotTime || pointSlotTime > currentSlotTime) {
      return;
    }

    const currentPointInSlot = pointsBySlot.get(pointSlotTime);
    if (
      !currentPointInSlot ||
      pointTime > new Date(currentPointInSlot.hourISO).getTime()
    ) {
      pointsBySlot.set(pointSlotTime, point);
    }
  });

  return Array.from({ length: slotCount }).map((_, index) => {
    const slotTime =
      firstSlotTime + index * GATEWAY_INTERVAL_MS;

    return {
      label: formatPointTime(new Date(slotTime).toISOString()),
      point: pointsBySlot.get(slotTime),
    };
  });
};

const buildChartData = (
  slots: HistorySlot[],
  valueSelector: (point: HourPoint) => number
): BarChartPoint[] =>
  slots.map((slot) => ({
    label: slot.label,
    value: slot.point ? valueSelector(slot.point) : 0,
    hasData: !!slot.point,
  }));

export default function HistoryScreen() {
  const { selectedLocation } = useSelectedLocation();
  const { data, loading, error } = useFirebaseHistory(
    selectedLocation,
    HISTORY_POINT_COUNT
  );
  const historyPoints = error ? mockHours : data;
  const historySlots = buildHistorySlots(historyPoints);

  return (
    <Screen>
      <AppHeader
        title="History"
        subtitle={`${selectedLocation} - 12 lần đo gần nhất`}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={COLORS.primary} />
          </View>
        )}
        {!!error && (
          <Text style={styles.errorText}>
            Không đọc được Firebase, đang hiển thị dữ liệu mẫu.
          </Text>
        )}

        <SimpleBarChart
          title="AQI - Recent"
          data={buildChartData(historySlots, (point) => point.aqi)}
        />
        <SimpleBarChart
          title="CO - Recent"
          data={buildChartData(historySlots, (point) => point.co)}
          unit="µg/m³"
        />
        <SimpleBarChart
          title="PM2.5 - Recent"
          data={buildChartData(historySlots, (point) => point.pm25)}
          unit="µg/m³"
        />
        <SimpleBarChart
          title="PM10 - Recent"
          data={buildChartData(historySlots, (point) => point.pm10)}
          unit="µg/m³"
        />
        <SimpleBarChart
          title="UV Index - Recent"
          data={buildChartData(historySlots, (point) => point.uvIndex)}
        />
        <SimpleBarChart
          title="Temperature - Recent"
          data={buildChartData(historySlots, (point) => point.temperatureC)}
          unit="°C"
        />
        <SimpleBarChart
          title="Humidity - Recent"
          data={buildChartData(historySlots, (point) => point.humidity)}
          unit="%"
        />
        <SimpleBarChart
          title="Predicted AQI - Recent"
          data={buildChartData(historySlots, (point) => point.predictedAqi)}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 28,
  },
  loadingRow: {
    marginHorizontal: 16,
    marginTop: 4,
    alignItems: "center",
  },
  errorText: {
    color: COLORS.warning,
    marginHorizontal: 16,
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
  },
});
