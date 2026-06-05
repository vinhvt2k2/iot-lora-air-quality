import AppHeader from "@/components/common/AppHeader";
import Screen from "@/components/common/Screen";
import { COLORS } from "@/constants/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SettingsScreen() {
  return (
    <Screen>
      <AppHeader title="Settings" subtitle="Cấu hình app / city / units..." />
      <View style={styles.box}>
        <Text style={styles.text}>Màn cài đặt (UI trước).</Text>
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
