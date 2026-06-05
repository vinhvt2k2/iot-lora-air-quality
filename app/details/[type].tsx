import SimpleBarChart from "@/components/charts/SimpleBarChart";
import AppHeader from "@/components/common/AppHeader";
import Screen from "@/components/common/Screen";
import { COLORS } from "@/constants/colors";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const titleMap: Record<string, string> = {
  aqi: "AQI Details",
  pm25: "PM2.5 Details",
  pm10: "PM10 Details",
  co: "CO Details",
  uv: "UV Details",
  predict: "Predicted AQI",
};

const demoChartData = Array.from({ length: 12 }).map((_, index) => ({
  label: `${index + 1}`,
  value: index > 7 ? 40 + index * 3 : 0,
}));

export default function DetailsScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const title = titleMap[type ?? ""] ?? "Details";

  return (
    <Screen>
      <AppHeader
        title={title}
        rightIcon="arrow-back"
        onRightPress={() => router.back()}
      />

      <SimpleBarChart title="Hourly chart (demo)" data={demoChartData} />

      <View style={styles.box}>
        <Text style={styles.text}>
          Đây là màn chi tiết cho: <Text style={styles.bold}>{type}</Text>
        </Text>
        <Text style={styles.muted}>
          Bước tiếp theo: thay mock bằng dữ liệu thật + hiển thị chart theo giờ.
        </Text>
      </View>

      <Pressable
        style={styles.btn}
        onPress={() => router.push("/(tabs)/history")}
      >
        <Text style={styles.btnText}>Xem lịch sử theo giờ</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  box: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  text: { color: COLORS.text, marginBottom: 8 },
  bold: { fontWeight: "800" },
  muted: { color: COLORS.muted },
  btn: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  btnText: { color: "#001018", fontWeight: "800" },
});
