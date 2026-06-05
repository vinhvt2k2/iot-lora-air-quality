import SimpleBarChart, {
  BarChartPoint,
} from "@/components/charts/SimpleBarChart";
import AppHeader from "@/components/common/AppHeader";
import Screen from "@/components/common/Screen";
import { COLORS } from "@/constants/colors";
import { useSelectedLocation } from "@/context/location-context";
import { useFirebaseCurrentEnv } from "@/hooks/use-firebase-current-env";
import { mockCurrent } from "@/mock/sample";
import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

const buildHourlyData = (currentValue: number): BarChartPoint[] => {
  const now = new Date();

  return Array.from({ length: 12 }).map((_, index) => {
    const hour = new Date(now);
    hour.setHours(now.getHours() - (11 - index));

    let value = 0;
    if (index === 8) value = currentValue * 0.86;
    if (index === 9) value = currentValue * 0.92;
    if (index === 10) value = currentValue * 0.96;
    if (index === 11) value = currentValue;

    return {
      label: hour.getHours().toString().padStart(2, "0"),
      value,
    };
  });
};

export default function HistoryScreen() {
  const { selectedLocation } = useSelectedLocation();
  const { data, loading, error } = useFirebaseCurrentEnv(selectedLocation);
  const current = data ?? {
    ...mockCurrent,
    city: selectedLocation,
    locationId: selectedLocation,
  };

  return (
    <Screen>
      <AppHeader
        title="History (Hourly)"
        subtitle={`${current.city} - AQI / CO / PM2.5 / PM10 theo giờ`}
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

        <SimpleBarChart title="AQI - Hourly" data={buildHourlyData(current.aqi)} />
        <SimpleBarChart
          title="CO - Hourly"
          data={buildHourlyData(current.co)}
          unit="µg/m³"
        />
        <SimpleBarChart
          title="PM2.5 - Hourly"
          data={buildHourlyData(current.pm25)}
          unit="µg/m³"
        />
        <SimpleBarChart
          title="PM10 - Hourly"
          data={buildHourlyData(current.pm10)}
          unit="µg/m³"
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
