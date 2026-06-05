import { AppAlert } from "@/features/alerts/rules";
import { router } from "expo-router";
import * as Notifications from "expo-notifications";
import { useEffect, useMemo, useRef, useState } from "react";
import { Platform } from "react-native";

const ALERT_CHANNEL_ID = "smartcity-alerts";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const formatValue = (alert: AppAlert) => {
  const value = Number.isInteger(alert.value)
    ? `${alert.value}`
    : alert.value.toFixed(1);

  return alert.unit ? `${value} ${alert.unit}` : value;
};

async function ensureNotificationPermission() {
  const currentPermission = await Notifications.getPermissionsAsync();
  let status = currentPermission.status;

  if (status !== "granted") {
    const nextPermission = await Notifications.requestPermissionsAsync();
    status = nextPermission.status;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(ALERT_CHANNEL_ID, {
      name: "Smart City Alerts",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#35C2FF",
      sound: "default",
    });
  }

  return status === "granted";
}

export function useAlertPushNotifications({
  alerts,
  locationId,
  enabled = true,
}: {
  alerts: AppAlert[];
  locationId: string;
  enabled?: boolean;
}) {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const sentAlertKeysRef = useRef<Set<string>>(new Set());
  const alertSignature = useMemo(
    () => alerts.map((alert) => `${locationId}:${alert.id}`).join("|"),
    [alerts, locationId]
  );

  useEffect(() => {
    if (!enabled) return;

    let active = true;

    const prepareNotifications = async () => {
      try {
        const granted = await ensureNotificationPermission();
        if (active) {
          setPermissionGranted(granted);
        }
      } catch {
        if (active) {
          setPermissionGranted(false);
        }
      }
    };

    void prepareNotifications();

    return () => {
      active = false;
    };
  }, [enabled]);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      () => {
        router.push("/notifications");
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const activeAlertKeys = new Set(
      alerts.map((alert) => `${locationId}:${alert.id}`)
    );

    for (const alertKey of sentAlertKeysRef.current) {
      if (alertKey.startsWith(`${locationId}:`) && !activeAlertKeys.has(alertKey)) {
        sentAlertKeysRef.current.delete(alertKey);
      }
    }

    if (!enabled || !permissionGranted || alerts.length === 0) return;

    const sendNotifications = async () => {
      for (const alert of alerts) {
        const alertKey = `${locationId}:${alert.id}`;

        if (sentAlertKeysRef.current.has(alertKey)) {
          continue;
        }

        sentAlertKeysRef.current.add(alertKey);

        await Notifications.scheduleNotificationAsync({
          content: {
            title: `${alert.metric} - ${locationId}`,
            body: `${alert.title} Giá trị hiện tại: ${formatValue(alert)}.`,
            sound: "default",
            priority: Notifications.AndroidNotificationPriority.HIGH,
            data: {
              alertId: alert.id,
              locationId,
            },
          },
          trigger:
            Platform.OS === "android" ? { channelId: ALERT_CHANNEL_ID } : null,
        });
      }

      await Notifications.setBadgeCountAsync(alerts.length);
    };

    void sendNotifications();
  }, [alerts, alertSignature, enabled, locationId, permissionGranted]);

  useEffect(() => {
    if (alerts.length === 0) {
      void Notifications.setBadgeCountAsync(0);
    }
  }, [alerts.length]);

  return { permissionGranted };
}
