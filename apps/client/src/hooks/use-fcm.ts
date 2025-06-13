// src/hooks/useFirebaseMessaging.ts
import { useEffect } from "react";

import { getToken, messaging, onMessage } from "~/lib/firebase";

export function useFirebaseMessaging(
  onMessageReceived: (payload: any) => void
) {
  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        getToken(messaging, { vapidKey: "YOUR_VAPID_KEY" }).then((token) => {
          console.log("FCM Token:", token);
          // Burada backend'e token'ı yolla (axios, fetch vs)
        });
      }
    });

    // Sayfa açıkken gelen mesajları yakala
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Message received: ", payload);
      onMessageReceived(payload);
    });

    return () => unsubscribe();
  }, [onMessageReceived]);
}
