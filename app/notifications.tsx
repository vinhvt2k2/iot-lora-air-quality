import AppHeader from "@/components/common/AppHeader";
import Screen from "@/components/common/Screen";
import { COLORS } from "@/constants/colors";
import { useSelectedLocation } from "@/context/location-context";
import { getActiveAlerts } from "@/features/alerts/rules";
import { useAlertNotificationList } from "@/hooks/use-alert-notification-list";
import { useFirebaseCurrentEnv } from "@/hooks/use-firebase-current-env";
import { mockCurrent } from "@/mock/sample";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const formatValue = (value: number, unit?: string) => {
  const formatted = Number.isInteger(value) ? `${value}` : value.toFixed(1);
  return unit ? `${formatted} ${unit}` : formatted;
};

const formatRelativeTime = (createdAt: number, now: number) => {
  const diffMs = Math.max(now - createdAt, 0);
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return "vừa xong";
  if (minutes < 60) return `${minutes}p trước`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;

  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
};

export default function NotificationsScreen() {
  const { selectedLocation } = useSelectedLocation();
  const { data, loading, error } = useFirebaseCurrentEnv(selectedLocation);
  const [now, setNow] = useState(Date.now());
  const current = useMemo(
    () =>
      data ?? {
        ...mockCurrent,
        city: selectedLocation,
        locationId: selectedLocation,
      },
    [data, selectedLocation],
  );
  const alerts = useMemo(() => getActiveAlerts(current), [current]);
  const { notifications, deleteNotification } = useAlertNotificationList(
    alerts,
    selectedLocation,
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 60000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Screen>
      <AppHeader
        title="Alerts"
        subtitle={current.city}
        rightIcon="arrow-back"
        onRightPress={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={COLORS.primary} />
          </View>
        )}

        {!!error && (
          <Text style={styles.errorText}>
            Không đọc được Firebase, đang hiển thị dữ liệu mẫu.
          </Text>
        )}

        <View style={styles.summary}>
          <View style={styles.summaryIcon}>
            <Ionicons
              name={notifications.length > 0 ? "warning" : "checkmark-circle"}
              size={24}
              color={notifications.length > 0 ? COLORS.warning : COLORS.success}
            />
          </View>
          <View style={styles.summaryTextWrap}>
            <Text style={styles.summaryTitle}>
              {notifications.length > 0
                ? `${notifications.length} thông báo đang hiển thị`
                : "Không có cảnh báo"}
            </Text>
            <Text style={styles.summarySub}>
              Dựa trên dữ liệu hiện tại của {current.city}
            </Text>
          </View>
        </View>

        {notifications.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons
              name="shield-checkmark"
              size={34}
              color={COLORS.success}
            />
            <Text style={styles.emptyTitle}>
              {alerts.length === 0
                ? "Các chỉ số đang trong ngưỡng an toàn."
                : "Bạn đã xoá tất cả thông báo đang hiển thị."}
            </Text>
            <Text style={styles.emptySub}>
              App sẽ hiển thị cảnh báo khi AQI, nhiệt độ, bụi mịn, độ ẩm, CO
              hoặc UV vượt ngưỡng.
            </Text>
          </View>
        ) : (
          notifications.map((alert) => (
            <View
              key={alert.notificationKey}
              style={[
                styles.alertCard,
                alert.severity === "danger" && styles.alertCardDanger,
              ]}
            >
              <View style={styles.alertIcon}>
                <Ionicons
                  name={
                    alert.severity === "danger" ? "alert-circle" : "warning"
                  }
                  size={22}
                  color={
                    alert.severity === "danger" ? COLORS.danger : COLORS.warning
                  }
                />
              </View>
              <View style={styles.alertBody}>
                <View style={styles.alertMetaRow}>
                  <Text style={styles.metric}>{alert.metric}</Text>
                  <View style={styles.alertRightMeta}>
                    <Text style={styles.condition}>{alert.condition}</Text>
                    <Pressable
                      style={styles.deleteButton}
                      onPress={() => deleteNotification(alert.notificationKey)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={17}
                        color={COLORS.muted}
                      />
                    </Pressable>
                  </View>
                </View>
                <Text style={styles.alertTitle}>{alert.title}</Text>
                <View style={styles.alertFooter}>
                  <Text style={styles.alertValue}>
                    Giá trị hiện tại: {formatValue(alert.value, alert.unit)}
                  </Text>
                  <Text style={styles.alertTime}>
                    {formatRelativeTime(alert.createdAt, now)}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 28,
  },
  loadingRow: {
    marginHorizontal: 16,
    marginTop: 4,
    alignItems: "center",
  },
  errorText: {
    color: COLORS.warning,
    marginHorizontal: 16,
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
  },
  summary: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 14,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  summaryTextWrap: {
    flex: 1,
  },
  summaryTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "800",
  },
  summarySub: {
    color: COLORS.muted,
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
  },
  emptyBox: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 18,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 10,
  },
  emptySub: {
    color: COLORS.muted,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  alertCard: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: "rgba(255,209,102,0.35)",
    flexDirection: "row",
    gap: 12,
  },
  alertCardDanger: {
    borderColor: "rgba(255,92,122,0.45)",
  },
  alertIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  alertBody: {
    flex: 1,
    minWidth: 0,
  },
  alertMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  alertRightMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metric: {
    color: COLORS.text,
    fontWeight: "800",
  },
  condition: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "700",
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  alertTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "800",
    marginTop: 8,
    lineHeight: 21,
  },
  alertFooter: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  alertValue: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "700",
    flex: 1,
  },
  alertTime: {
    color: COLORS.sub,
    fontSize: 12,
    fontWeight: "800",
  },
});
