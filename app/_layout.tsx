import { LocationProvider } from "@/context/location-context";
import { isRunningInExpoGo } from "expo";
import { Stack } from "expo-router";
import React, { Suspense } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

const AlertNotificationBridge = isRunningInExpoGo()
  ? null
  : React.lazy(() => import("@/components/notifications/AlertNotificationBridge"));

function OptionalAlertNotificationBridge() {
  if (!AlertNotificationBridge) return null;

  return (
    <Suspense fallback={null}>
      <AlertNotificationBridge />
    </Suspense>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LocationProvider>
        <OptionalAlertNotificationBridge />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="details/[type]" />
          <Stack.Screen name="notifications" />
        </Stack>
      </LocationProvider>
    </SafeAreaProvider>
  );
}
