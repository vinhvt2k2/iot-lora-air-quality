import AQIHeroCircle from "@/components/cards/AQIHeroCircle";
import { COLORS } from "@/constants/colors";
import { useSelectedLocation } from "@/context/location-context";
import { getActiveAlerts } from "@/features/alerts/rules";
import { useFirebaseCurrentEnv } from "@/hooks/use-firebase-current-env";
import { useFirebaseLocations } from "@/hooks/use-firebase-locations";
import { mockCurrent } from "@/mock/sample";
import { getLocationTitle } from "@/services/firebaseRealtime";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

const formatUpdatedAt = (iso: string) =>
  new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const getProgressColor = (value: number, maxValue: number) => {
  const percent = maxValue > 0 ? value / maxValue : 0;

  if (percent < 0.35) return COLORS.green;
  if (percent < 0.65) return COLORS.yellow;
  if (percent < 0.85) return COLORS.orange;
  return COLORS.red;
};

function MetricProgressTile({
  title,
  value,
  unit,
  maxValue,
}: {
  title: string;
  value: number;
  unit?: string;
  maxValue: number;
}) {
  const progress = Math.min(Math.max(value / maxValue, 0), 1);
  const color = getProgressColor(value, maxValue);
  const formattedValue = Number.isInteger(value) ? `${value}` : value.toFixed(1);

  return (
    <View style={styles.metricItem}>
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={styles.metricValue}>
        {formattedValue}
        {!!unit && <Text style={styles.metricUnit}> {unit}</Text>}
      </Text>
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${progress * 100}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const { selectedLocation, setSelectedLocation } = useSelectedLocation();
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const {
    locations,
    loading: locationsLoading,
    error: locationsError,
  } = useFirebaseLocations();
  const { data: firebaseData, loading, error } =
    useFirebaseCurrentEnv(selectedLocation);
  const current = firebaseData ?? {
    ...mockCurrent,
    city: selectedLocation,
    locationId: selectedLocation,
  };
  const alertCount = getActiveAlerts(current).length;
  const locationLoadError = error || locationsError;
  const metricItems = [
    { title: "PM2.5", value: current.pm25, unit: "µg/m³", maxValue: 100 },
    { title: "PM10", value: current.pm10, unit: "µg/m³", maxValue: 200 },
    { title: "CO", value: current.co, unit: "µg/m³", maxValue: 1000 },
    { title: "UV", value: current.uvIndex, maxValue: 12 },
    { title: "Nhiệt độ", value: current.temperatureC, unit: "°C", maxValue: 50 },
    { title: "Độ ẩm", value: current.humidity, unit: "%", maxValue: 100 },
    { title: "AQI dự đoán", value: current.predictedAqi, maxValue: 500 },
  ];

  return (
    <ImageBackground
      source={require("../../assets/images/background.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerInfo}>
              <Text style={styles.city}>{current.city}</Text>
              <View style={styles.updateRow}>
                <Text style={styles.update}>
                  Update: {formatUpdatedAt(current.updatedAt)}
                </Text>
                {loading && (
                  <ActivityIndicator size="small" color={COLORS.primary} />
                )}
              </View>
            </View>
            <View style={styles.headerActions}>
              <Pressable
                style={styles.locationSelect}
                onPress={() => setLocationModalVisible(true)}
              >
                <Ionicons name="location" size={18} color={COLORS.primary} />
                <Text style={styles.locationText}>
                  {getLocationTitle(selectedLocation)}
                </Text>
                <Ionicons name="chevron-down" size={16} color={COLORS.sub} />
              </Pressable>
              <Pressable
                style={styles.bell}
                onPress={() => router.push("/notifications")}
              >
                <Ionicons name="notifications" size={22} color={COLORS.text} />
                {alertCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{alertCount}</Text>
                  </View>
                )}
              </Pressable>
            </View>
          </View>
          {!!locationLoadError && (
            <Text style={styles.errorText}>
              Không đọc được Firebase, đang hiển thị dữ liệu mẫu.
            </Text>
          )}

          <View style={styles.aqiCard}>
            <AQIHeroCircle aqi={current.aqi} />
            <Text style={styles.aqiAdvice}>
              Chất lượng không khí được cập nhật theo dữ liệu hiện tại của{" "}
              {current.city}.
            </Text>
          </View>

          <View style={styles.metricsCard}>
            {metricItems.map((item) => (
              <MetricProgressTile
                key={item.title}
                title={item.title}
                value={item.value}
                unit={item.unit}
                maxValue={item.maxValue}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
      <Modal
        transparent
        animationType="fade"
        visible={locationModalVisible}
        onRequestClose={() => setLocationModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setLocationModalVisible(false)}
        >
          <Pressable style={styles.locationMenu}>
            <Text style={styles.menuTitle}>Chọn location</Text>
            {locationsLoading && (
              <ActivityIndicator color={COLORS.primary} style={styles.menuLoader} />
            )}
            {locations.map((locationId) => {
              const selected = locationId === selectedLocation;

              return (
                <Pressable
                  key={locationId}
                  style={[
                    styles.locationOption,
                    selected && styles.locationOptionActive,
                  ]}
                  onPress={() => {
                    setSelectedLocation(locationId);
                    setLocationModalVisible(false);
                  }}
                >
                  <View style={styles.locationOptionLabel}>
                    <Ionicons
                      name="location"
                      size={18}
                      color={selected ? COLORS.primary : COLORS.sub}
                    />
                    <Text
                      style={[
                        styles.locationOptionText,
                        selected && styles.locationOptionTextActive,
                      ]}
                    >
                      {getLocationTitle(locationId)}
                    </Text>
                  </View>
                  {selected && (
                    <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                  )}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: COLORS.bg },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(9,15,30,0.68)",
  },
  safe: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  content: { paddingBottom: 28 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerInfo: { flex: 1, minWidth: 0 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  city: { color: COLORS.text, fontSize: 28, fontWeight: "800" },
  update: { color: COLORS.sub, marginTop: 4 },
  updateRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  errorText: {
    color: COLORS.warning,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 10,
  },
  bell: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 5,
    backgroundColor: COLORS.danger,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.bg,
  },
  badgeText: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: "900",
  },
  locationSelect: {
    height: 46,
    maxWidth: 150,
    borderRadius: 14,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 10,
  },
  locationText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "800",
    flexShrink: 1,
  },

  aqiCard: {
    backgroundColor: COLORS.card2,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: "center",
  },
  aqiAdvice: {
    color: COLORS.sub,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 14,
    paddingHorizontal: 6,
    fontWeight: "600",
  },
  metricsCard: {
    marginTop: 14,
    backgroundColor: COLORS.card2,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 18,
  },
  metricItem: {
    width: "33.333%",
    paddingHorizontal: 8,
  },
  metricTitle: {
    color: COLORS.sub,
    fontSize: 13,
    fontWeight: "800",
  },
  metricValue: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "800",
    marginTop: 3,
  },
  metricUnit: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: "800",
  },
  progressTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(234,240,255,0.16)",
    overflow: "hidden",
    marginTop: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 92,
    paddingHorizontal: 16,
  },
  locationMenu: {
    width: 230,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 10,
  },
  menuTitle: {
    color: COLORS.sub,
    fontSize: 13,
    fontWeight: "800",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  menuLoader: { paddingVertical: 10 },
  locationOption: {
    minHeight: 44,
    borderRadius: 12,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  locationOptionActive: {
    backgroundColor: "rgba(53,194,255,0.12)",
  },
  locationOptionLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  locationOptionText: {
    color: COLORS.text,
    fontWeight: "700",
  },
  locationOptionTextActive: {
    color: COLORS.primary,
  },
});
