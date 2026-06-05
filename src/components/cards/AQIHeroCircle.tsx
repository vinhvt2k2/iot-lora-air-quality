import { COLORS } from "@/constants/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

function aqiLabel(aqi: number) {
  if (aqi <= 50) return { label: "Tốt", color: COLORS.green };
  if (aqi <= 100) return { label: "Trung bình", color: COLORS.yellow };
  if (aqi <= 150) return { label: "Kém", color: COLORS.orange };
  if (aqi <= 200) return { label: "Xấu", color: COLORS.red };
  if (aqi <= 300) return { label: "Rất xấu", color: COLORS.purple };
  return { label: "Nguy hại", color: "#7F1D1D" };
}

export default function AQIHeroCircle({ aqi }: { aqi: number }) {
  const meta = aqiLabel(aqi);

  return (
    <View style={styles.wrap}>
      <View style={[styles.circle, { borderColor: meta.color }]}>
        <Text style={styles.aqi}>{aqi}</Text>
        <Text style={[styles.label, { color: meta.color }]}>{meta.label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
  circle: {
    width: 140,
    height: 140,
    borderRadius: 28,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  aqi: { fontSize: 52, fontWeight: "800", color: COLORS.text },
  label: { marginTop: 6, fontSize: 16, fontWeight: "700" },
});
