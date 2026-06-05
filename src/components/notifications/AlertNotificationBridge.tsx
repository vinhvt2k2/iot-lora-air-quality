import { useSelectedLocation } from "@/context/location-context";
import { getActiveAlerts } from "@/features/alerts/rules";
import { useAlertPushNotifications } from "@/hooks/use-alert-push-notifications";
import { useFirebaseCurrentEnv } from "@/hooks/use-firebase-current-env";

export default function AlertNotificationBridge() {
  const { selectedLocation } = useSelectedLocation();
  const { data } = useFirebaseCurrentEnv(selectedLocation);
  const alerts = data ? getActiveAlerts(data) : [];

  useAlertPushNotifications({
    alerts,
    locationId: selectedLocation,
    enabled: !!data,
  });

  return null;
}
