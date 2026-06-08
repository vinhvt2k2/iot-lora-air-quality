import { COLORS } from "@/constants/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

function aqiLabel(aqi: number) {
  if (aqi <= 50) return { label: "Tốt", color: COLORS.green };
  if (aqi <= 100) return { label: "Trung bình", color: COLORS.yellow };
  if (aqi <= 150) return { label: "Kém", color: COLORS.orange };
  if (aqi <= 200) return { label: "Xấu", color: COLORS.red };
  if (aqi <= 300) return { label: "Rất xấu", color: COLORS.purple };
  return { label: "Nguy hại", color: "#7F1D1D" };
}

const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const describeArc = (
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");
};

export default function AQIHeroCircle({ aqi }: { aqi: number }) {
  const meta = aqiLabel(aqi);
  const maxAqi = 500;
  const startAngle = 220;
  const sweepAngle = 280;
  const progress = Math.min(Math.max(aqi / maxAqi, 0), 1);
  const endAngle = startAngle + sweepAngle;
  const progressEndAngle = startAngle + sweepAngle * progress;
  const gaugeSize = 230;
  const center = gaugeSize / 2;
  const radius = 92;

  return (
    <View style={styles.wrap}>
      <Svg width={gaugeSize} height={190} viewBox={`0 0 ${gaugeSize} 190`}>
        <Path
          d={describeArc(center, center, radius, startAngle, endAngle)}
          stroke="rgba(234,240,255,0.14)"
          strokeWidth={14}
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d={describeArc(center, center, radius, startAngle, progressEndAngle)}
          stroke={meta.color}
          strokeWidth={14}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
      <View style={styles.valueWrap}>
        <Text style={styles.caption}>AQI</Text>
        <Text style={styles.aqi}>{Math.round(aqi)}</Text>
        <Text style={[styles.label, { color: meta.color }]}>{meta.label}</Text>
      </View>
      <View style={styles.scaleRow}>
        <Text style={styles.scaleText}>0</Text>
        <Text style={styles.scaleText}>500</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: 250,
  },
  valueWrap: {
    position: "absolute",
    top: 48,
    alignItems: "center",
  },
  caption: {
    color: COLORS.sub,
    fontSize: 15,
    fontWeight: "800",
  },
  aqi: { fontSize: 58, fontWeight: "800", color: COLORS.text },
  label: { marginTop: 2, fontSize: 16, fontWeight: "800" },
  scaleRow: {
    position: "absolute",
    left: 42,
    right: 42,
    bottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scaleText: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: "800",
  },
});
