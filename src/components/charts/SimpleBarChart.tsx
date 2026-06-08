import { COLORS } from "@/constants/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type BarChartPoint = {
  label: string;
  value: number;
  hasData?: boolean;
};

const BAR_TRACK_HEIGHT = 112;

const formatChartValue = (value: number) =>
  Number.isInteger(value) ? `${value}` : value.toFixed(value >= 10 ? 1 : 2);

export default function SimpleBarChart({
  title,
  data,
  unit,
}: {
  title: string;
  data: BarChartPoint[];
  unit?: string;
}) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.max}>
          Max {maxValue.toFixed(maxValue >= 100 ? 0 : 1)}
          {unit ? ` ${unit}` : ""}
        </Text>
      </View>

      <View style={styles.plot}>
        {data.map((item, index) => {
          const hasData = item.hasData !== false;
          const height = hasData
            ? Math.max(
                (item.value / maxValue) * BAR_TRACK_HEIGHT,
                item.value > 0 ? 4 : 0
              )
            : 0;

          return (
            <View key={`${item.label}-${index}`} style={styles.barSlot}>
              <Text style={[styles.valueLabel, !hasData && styles.emptyValue]}>
                {hasData ? formatChartValue(item.value) : "-"}
              </Text>
              <View style={styles.barTrack}>
                <View style={[styles.bar, { height }]} />
              </View>
              <Text style={styles.label}>{item.label}</Text>
            </View>
          );
        })}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: { color: COLORS.text, fontWeight: "700" },
  max: { color: COLORS.muted, fontSize: 12, fontWeight: "700" },
  plot: {
    height: 170,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 8,
  },
  barSlot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    minWidth: 0,
  },
  barTrack: {
    height: BAR_TRACK_HEIGHT,
    width: "58%",
    justifyContent: "flex-end",
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    overflow: "hidden",
  },
  valueLabel: {
    color: COLORS.text,
    fontSize: 9,
    fontWeight: "800",
    marginBottom: 6,
    minHeight: 12,
    textAlign: "center",
  },
  emptyValue: {
    color: COLORS.muted,
  },
  bar: {
    width: "100%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: COLORS.primary,
  },
  label: {
    color: COLORS.muted,
    width: "100%",
    fontSize: 9,
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
  },
});
