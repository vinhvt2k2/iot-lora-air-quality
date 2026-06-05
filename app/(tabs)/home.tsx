import AQIHeroCircle from "@/components/cards/AQIHeroCircle";
import MetricTile from "@/components/cards/MetricTile";
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

  return (
    <ImageBackground
      source={require("../../assets/images/background.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text style={styles.city}>{current.city}</Text>
            <View style={styles.updateRow}>
              <Text style={styles.update}>
                Update: {formatUpdatedAt(current.updatedAt)}
              </Text>
              {loading && <ActivityIndicator size="small" color={COLORS.primary} />}
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

        {/* AQI Card */}
        <View style={styles.cardLarge}>
          <Text style={styles.cardTitle}>Air Quality Index</Text>
          <View style={styles.aqiRow}>
            <AQIHeroCircle aqi={current.aqi} />
            <View style={styles.legend}>
              <Text style={styles.legendItem}>0-50 Good</Text>
              <Text style={styles.legendItem}>51-100 Medium</Text>
              <Text style={styles.legendItem}>101-150 Poor</Text>
              <Text style={styles.legendItem}>151-200 Bad</Text>
              <Text style={styles.legendItem}>201-300 Very bad</Text>
              <Text style={styles.legendItem}>300+ Danger</Text>
            </View>
          </View>

          <Text style={styles.aqiToday}>AQI – Today</Text>
        </View>

        {/* Weather row */}
        <View style={styles.cardRow}>
          <View style={styles.cardHalf}>
            <Text style={styles.cardTitle}>Weather</Text>
            <Text style={styles.bigValue}>
              {current.temperatureC.toFixed(1)}°C
            </Text>
          </View>
          <View style={styles.cardHalf}>
            <Text style={styles.cardTitle}>Humidity</Text>
            <Text style={styles.bigValue}>{current.humidity.toFixed(1)}%</Text>
          </View>
        </View>

        {/* Metric grid */}
        <View style={styles.grid}>
          <MetricTile title="PM2.5" value={current.pm25.toFixed(1)} unit="µg/m³" />
          <MetricTile title="PM10" value={current.pm10.toFixed(1)} unit="µg/m³" />
        </View>
        <View style={styles.grid}>
          <MetricTile title="UV index" value={current.uvIndex.toFixed(2)} />
          <MetricTile title="CO" value={current.co.toFixed(2)} unit="µg/m³" />
        </View>

        <View style={styles.grid}>
          <MetricTile title="Predicted AQI" value={current.predictedAqi} />
          <View style={{ flex: 1 }} />
        </View>

        <Text style={styles.section}>AQI – Hourly</Text>
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

  cardLarge: {
    backgroundColor: COLORS.card2,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  cardTitle: { color: COLORS.sub, fontSize: 13, fontWeight: "700" },
  aqiRow: { flexDirection: "row", gap: 14, marginTop: 12 },
  legend: { flex: 1, justifyContent: "center" },
  legendItem: { color: COLORS.sub, marginVertical: 2, fontWeight: "600" },
  aqiToday: { color: COLORS.sub, marginTop: 10, fontWeight: "700" },

  cardRow: { flexDirection: "row", gap: 12, marginTop: 12 },
  cardHalf: {
    flex: 1,
    backgroundColor: COLORS.card2,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  bigValue: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: "800",
    marginTop: 6,
  },

  grid: { flexDirection: "row", gap: 12, marginTop: 12 },

  section: { color: COLORS.sub, marginTop: 16, fontWeight: "700" },
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
