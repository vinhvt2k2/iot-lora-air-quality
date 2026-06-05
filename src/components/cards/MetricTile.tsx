import { COLORS } from "@/constants/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function MetricTile({
  title,
  value,
  unit,
}: {
  title: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>
        {value} {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  title: { color: COLORS.sub, fontSize: 12, fontWeight: "600" },
  value: { marginTop: 6, color: COLORS.text, fontSize: 16, fontWeight: "800" },
  unit: { color: COLORS.sub, fontWeight: "700" },
});
