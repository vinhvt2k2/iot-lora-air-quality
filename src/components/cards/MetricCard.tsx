import { COLORS } from "@/constants/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function MetricCard({
  title,
  value,
  unit,
}: {
  title: string;
  value: string;
  unit?: string;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>
        {value} {!!unit && <Text style={styles.unit}>{unit}</Text>}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 14,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: { color: COLORS.muted, marginBottom: 8 },
  value: { color: COLORS.text, fontSize: 20, fontWeight: "700" },
  unit: { color: COLORS.muted, fontSize: 12, fontWeight: "500" },
});
