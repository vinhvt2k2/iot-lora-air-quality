import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function AppHeader({
  title,
  subtitle,
  rightIcon,
  onRightPress,
}: {
  title: string;
  subtitle?: string;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <View>
        <Text style={styles.title}>{title}</Text>
        {!!subtitle && <Text style={styles.sub}>{subtitle}</Text>}
      </View>

      {!!rightIcon && (
        <Pressable onPress={onRightPress} style={styles.iconBtn}>
          <Ionicons name={rightIcon} size={22} color={COLORS.text} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { color: COLORS.text, fontSize: 22, fontWeight: "700" },
  sub: { color: COLORS.muted, marginTop: 4 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});
