import { COLORS } from "@/constants/colors";
import { format1 } from "@/features/aqi/aqiFormat";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function WeatherCard({
  tempC,
  humidity,
}: {
  tempC: number;
  humidity: number;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Weather</Text>
      <View style={styles.row}>
        <Text style={styles.value}>{format1(tempC)}°C</Text>
        <Text style={styles.muted}>Humidity: {format1(humidity)}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: { color: COLORS.muted, marginBottom: 8 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  value: { color: COLORS.text, fontSize: 18, fontWeight: "700" },
  muted: { color: COLORS.muted },
});
