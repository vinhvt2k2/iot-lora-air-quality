import AppHeader from "@/components/common/AppHeader";
import Screen from "@/components/common/Screen";
import { COLORS } from "@/constants/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ForecastScreen() {
  return (
    <Screen>
      <AppHeader
        title="Forecast"
        subtitle="Dự báo thời tiết / AQI (sẽ nối API sau)"
      />
      <View style={styles.box}>
        <Text style={styles.text}>Màn dự báo 7 ngày (UI trước).</Text>
      </View>
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
  text: { color: COLORS.text },
});
