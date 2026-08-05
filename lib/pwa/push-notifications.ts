/**
 * Push notification helpers — placeholder until browser push is implemented.
 * Requires an active service worker registration (`/sw.js`).
 */

export type PushSubscriptionPayload = {
  endpoint: string;
  keys?: {
    p256dh: string;
    auth: string;
  };
};

export async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  return (await navigator.serviceWorker.getRegistration("/")) ?? null;
}

export async function isPushSupported(): Promise<boolean> {
  if (typeof window === "undefined") {
    return false;
  }

  return "PushManager" in window && "serviceWorker" in navigator;
}

/** Placeholder — future: subscribe with VAPID public key and persist server-side. */
export async function subscribeToPushNotifications(): Promise<PushSubscriptionPayload | null> {
  const supported = await isPushSupported();
  if (!supported) {
    return null;
  }

  const registration = await getServiceWorkerRegistration();
  if (!registration) {
    return null;
  }

  void registration;
  return null;
}
