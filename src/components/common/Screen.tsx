import { COLORS } from "@/constants/colors";
import React from "react";
import { StatusBar, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Screen({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: COLORS.bg }, style]}>
      <StatusBar barStyle="light-content" />
      {children}
    </SafeAreaView>
  );
}
