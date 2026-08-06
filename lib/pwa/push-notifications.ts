/**
 * Push notification helpers — subscribe via the existing Serwist service worker.
 */

export type PushSubscriptionPayload = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

function getVapidPublicKey(): string | null {
  const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim();
  return key ? key : null;
}

function urlBase64ToUint8Array(base64String: string): BufferSource {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const output = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index += 1) {
    output[index] = rawData.charCodeAt(index);
  }

  return output;
}

function serializeSubscription(
  subscription: PushSubscription
): PushSubscriptionPayload | null {
  const json = subscription.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
    return null;
  }

  return {
    endpoint: json.endpoint,
    keys: {
      p256dh: json.keys.p256dh,
      auth: json.keys.auth,
    },
  };
}

export async function isPushSupported(): Promise<boolean> {
  if (typeof window === "undefined") {
    return false;
  }

  return "PushManager" in window && "serviceWorker" in navigator;
}

/**
 * Returns the existing True North service worker registration, registering
 * `/sw.js` only when needed so we reuse the Serwist worker.
 */
export async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  const existing =
    (await navigator.serviceWorker.getRegistration("/")) ??
    (await navigator.serviceWorker.getRegistration("/sw.js"));

  if (existing) {
    return existing;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
    await navigator.serviceWorker.ready;
    return registration;
  } catch (error) {
    console.error("[Push] Service worker registration failed:", error);
    return null;
  }
}

/**
 * Subscribes the browser for push using the VAPID public key.
 * Reuses an existing PushManager subscription when present.
 */
export async function subscribeToPushNotifications(): Promise<PushSubscriptionPayload | null> {
  const supported = await isPushSupported();
  if (!supported) {
    return null;
  }

  if (Notification.permission !== "granted") {
    return null;
  }

  const vapidPublicKey = getVapidPublicKey();
  if (!vapidPublicKey) {
    console.error("[Push] Missing NEXT_PUBLIC_VAPID_PUBLIC_KEY");
    return null;
  }

  const registration = await getServiceWorkerRegistration();
  if (!registration) {
    return null;
  }

  try {
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });
    }

    return serializeSubscription(subscription);
  } catch (error) {
    console.error("[Push] Subscription failed:", error);
    return null;
  }
}
