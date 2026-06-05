import { AppAlert } from "@/features/alerts/rules";
import { useEffect, useMemo, useRef, useState } from "react";

export type AlertNotificationItem = AppAlert & {
  notificationKey: string;
  createdAt: number;
};

export function useAlertNotificationList(alerts: AppAlert[], locationId: string) {
  const [items, setItems] = useState<AlertNotificationItem[]>([]);
  const [deletedKeys, setDeletedKeys] = useState<Set<string>>(new Set());
  const deletedKeysRef = useRef(deletedKeys);
  const alertsSignature = useMemo(
    () => alerts.map((alert) => `${locationId}:${alert.id}`).join("|"),
    [alerts, locationId]
  );
  const alertValuesSignature = useMemo(
    () =>
      alerts
        .map((alert) => `${locationId}:${alert.id}:${alert.value}`)
        .join("|"),
    [alerts, locationId]
  );

  useEffect(() => {
    deletedKeysRef.current = deletedKeys;
  }, [deletedKeys]);

  useEffect(() => {
    const activeKeys = new Set(
      alerts.map((alert) => `${locationId}:${alert.id}`)
    );

    setDeletedKeys((currentDeletedKeys) => {
      const nextDeletedKeys = new Set<string>();

      currentDeletedKeys.forEach((key) => {
        if (activeKeys.has(key)) {
          nextDeletedKeys.add(key);
        }
      });

      return nextDeletedKeys;
    });

    setItems((currentItems) => {
      const currentByKey = new Map(
        currentItems.map((item) => [item.notificationKey, item])
      );
      const now = Date.now();

      return alerts
        .map((alert) => {
          const notificationKey = `${locationId}:${alert.id}`;
          const currentItem = currentByKey.get(notificationKey);

          return {
            ...alert,
            notificationKey,
            createdAt: currentItem?.createdAt ?? now,
          };
        })
        .filter((item) => !deletedKeysRef.current.has(item.notificationKey));
    });
  }, [alertValuesSignature, alerts, alertsSignature, locationId]);

  const deleteNotification = (notificationKey: string) => {
    setDeletedKeys((currentDeletedKeys) => {
      const nextDeletedKeys = new Set(currentDeletedKeys);
      nextDeletedKeys.add(notificationKey);
      return nextDeletedKeys;
    });

    setItems((currentItems) =>
      currentItems.filter((item) => item.notificationKey !== notificationKey)
    );
  };

  return { notifications: items, deleteNotification };
}
