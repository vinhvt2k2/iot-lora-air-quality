import { COLORS } from "@/constants/colors";
import { format0 } from "@/features/aqi/aqiFormat";
import { aqiToLevel, levelMeta } from "@/features/aqi/aqiLevels";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function AQIHeroCard({ aqi }: { aqi: number }) {
  const level = aqiToLevel(aqi);
  const meta = levelMeta[level];

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Air Quality Index</Text>
      <View style={styles.row}>
        <View style={[styles.badge, { borderColor: meta.color }]}>
          <Text style={styles.big}>{format0(aqi)}</Text>
          <Text style={[styles.level, { color: meta.color }]}>
            {meta.label}
          </Text>
        </View>
        <View style={styles.legend}>
          <Text style={styles.muted}>0-50 Good</Text>
          <Text style={styles.muted}>51-100 Medium</Text>
          <Text style={styles.muted}>101-150 Poor</Text>
          <Text style={styles.muted}>151-200 Bad</Text>
          <Text style={styles.muted}>201-300 Very bad</Text>
          <Text style={styles.muted}>300+ Danger</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  label: { color: COLORS.muted, marginBottom: 12 },
  row: { flexDirection: "row", gap: 12 },
  badge: {
    width: 130,
    height: 130,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  big: { color: COLORS.text, fontSize: 40, fontWeight: "800" },
  level: { marginTop: 4, fontWeight: "700" },
  legend: { flex: 1, justifyContent: "center" },
  muted: { color: COLORS.muted, fontSize: 12, marginBottom: 4 },
});
