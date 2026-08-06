/**
 * send-notifications
 *
 * Cron-oriented Edge Function:
 * 1. Read every user's notification settings
 * 2. Check whether a reminder is due (local time)
 * 3. Skip reminders already completed for the period
 * 4. Send Web Push via stored subscriptions
 * 5. Log the outcome
 *
 * Secrets required:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   VAPID_PUBLIC_KEY
 *   VAPID_PRIVATE_KEY
 *   VAPID_SUBJECT (optional, mailto:…)
 *   CRON_SECRET (optional bearer for invoking the function)
 */

import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

type ReminderId =
  | "morningReminder"
  | "dailyDebriefReminder"
  | "weeklyReviewReminder"
  | "monthlyReviewReminder"
  | "annualReviewReminder";

type ReminderPreference = {
  enabled?: boolean;
  time?: string;
  days?: number[];
  dayOfMonth?: number;
  date?: string;
};

type NotificationSettings = Partial<Record<ReminderId, ReminderPreference>>;

type ProfileRow = {
  id: string;
  timezone: string | null;
  notification_preferences: NotificationSettings | null;
};

type PushSubscriptionRow = {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
};

const REMINDER_IDS: ReminderId[] = [
  "morningReminder",
  "dailyDebriefReminder",
  "weeklyReviewReminder",
  "monthlyReviewReminder",
  "annualReviewReminder",
];

const REMINDER_COPY: Record<
  ReminderId,
  { title: string; body: string; url: string }
> = {
  morningReminder: {
    title: "Morning Intent",
    body: "Return to identity before action.",
    url: "/",
  },
  dailyDebriefReminder: {
    title: "Daily Debrief",
    body: "Close the day with your Standard review.",
    url: "/debrief",
  },
  weeklyReviewReminder: {
    title: "Weekly Review",
    body: "Course-correct for the week ahead.",
    url: "/review/weekly",
  },
  monthlyReviewReminder: {
    title: "Monthly Reflection",
    body: "Step back and read the patterns.",
    url: "/review/monthly",
  },
  annualReviewReminder: {
    title: "Annual Review",
    body: "Confirm who you are becoming.",
    url: "/review/annual",
  },
};

type LocalParts = {
  dateKey: string;
  timeKey: string;
  weekday: number;
  dayOfMonth: number;
  monthDay: string;
  weekKey: string;
  monthKey: string;
  yearKey: string;
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function isAuthorized(req: Request): boolean {
  const header = req.headers.get("Authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return false;

  const cronSecret = Deno.env.get("CRON_SECRET");
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  return Boolean(
    (cronSecret && token === cronSecret) ||
      (serviceRole && token === serviceRole)
  );
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function getLocalParts(now: Date, timeZone: string): LocalParts {
  const safeZone = timeZone?.trim() || "UTC";

  let formatter: Intl.DateTimeFormat;
  try {
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: safeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      weekday: "short",
      hourCycle: "h23",
    });
  } catch {
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      weekday: "short",
      hourCycle: "h23",
    });
  }

  const parts = Object.fromEntries(
    formatter.formatToParts(now).map((part) => [part.type, part.value])
  );

  const year = Number(parts.year);
  const month = Number(parts.month);
  const day = Number(parts.day);
  const hour = Number(parts.hour);
  const minute = Number(parts.minute);

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const dateKey = `${year}-${pad2(month)}-${pad2(day)}`;
  const timeKey = `${pad2(hour)}:${pad2(minute)}`;
  const weekday = weekdayMap[parts.weekday] ?? 0;

  // ISO week number
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  const dayNum = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((utcDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );
  const weekKey = `${utcDate.getUTCFullYear()}-W${pad2(weekNo)}`;

  return {
    dateKey,
    timeKey,
    weekday,
    dayOfMonth: day,
    monthDay: `${pad2(month)}-${pad2(day)}`,
    weekKey,
    monthKey: `${year}-${pad2(month)}`,
    yearKey: String(year),
  };
}

function normalizeTime(value: string | undefined): string | null {
  if (!value || !/^\d{2}:\d{2}$/.test(value)) return null;
  return value;
}

function isReminderDue(
  reminderId: ReminderId,
  preference: ReminderPreference,
  local: LocalParts
): boolean {
  if (!preference.enabled) return false;

  const time = normalizeTime(preference.time);
  if (!time || time !== local.timeKey) return false;

  switch (reminderId) {
    case "morningReminder":
    case "dailyDebriefReminder":
      return true;
    case "weeklyReviewReminder": {
      const days = Array.isArray(preference.days) ? preference.days : [];
      return days.includes(local.weekday);
    }
    case "monthlyReviewReminder": {
      const dayOfMonth = preference.dayOfMonth ?? 1;
      return dayOfMonth === local.dayOfMonth;
    }
    case "annualReviewReminder": {
      const date = preference.date ?? "01-01";
      return date === local.monthDay;
    }
    default:
      return false;
  }
}

function periodKeyFor(
  reminderId: ReminderId,
  local: LocalParts
): string {
  switch (reminderId) {
    case "morningReminder":
    case "dailyDebriefReminder":
      return local.dateKey;
    case "weeklyReviewReminder":
      return local.weekKey;
    case "monthlyReviewReminder":
      return local.monthKey;
    case "annualReviewReminder":
      return local.yearKey;
  }
}

async function wasAlreadyHandled(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  reminderId: ReminderId,
  periodKey: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("notification_logs")
    .select("id")
    .eq("user_id", userId)
    .eq("reminder_id", reminderId)
    .eq("period_key", periodKey)
    .maybeSingle();

  if (error) {
    console.error("[send-notifications] log lookup failed", error);
    return false;
  }

  return Boolean(data);
}

async function isReminderCompleted(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  reminderId: ReminderId,
  local: LocalParts
): Promise<boolean> {
  if (reminderId === "morningReminder") {
    const { data, error } = await supabase
      .from("mission_intents")
      .select("id")
      .eq("user_id", userId)
      .eq("intent_date", local.dateKey)
      .maybeSingle();

    if (error) {
      console.error("[send-notifications] intent lookup failed", error);
      return false;
    }
    return Boolean(data);
  }

  if (reminderId === "dailyDebriefReminder") {
    const { data, error } = await supabase
      .from("daily_debriefs")
      .select("id")
      .eq("user_id", userId)
      .eq("debrief_date", local.dateKey)
      .maybeSingle();

    if (error) {
      console.error("[send-notifications] debrief lookup failed", error);
      return false;
    }
    return Boolean(data);
  }

  // Weekly / monthly / annual completion is tracked via notification_logs only
  // until dedicated review tables are wired for scheduling.
  return false;
}

async function writeLog(
  supabase: ReturnType<typeof createClient>,
  entry: {
    user_id: string;
    reminder_id: ReminderId;
    period_key: string;
    status: "sent" | "skipped_completed" | "failed";
    endpoint?: string | null;
    error?: string | null;
  }
): Promise<void> {
  const { error } = await supabase.from("notification_logs").upsert(
    {
      user_id: entry.user_id,
      reminder_id: entry.reminder_id,
      period_key: entry.period_key,
      status: entry.status,
      endpoint: entry.endpoint ?? null,
      error: entry.error ?? null,
    },
    { onConflict: "user_id,reminder_id,period_key" }
  );

  if (error) {
    console.error("[send-notifications] failed to write log", error);
  }
}

async function sendPushToSubscriptions(
  subscriptions: PushSubscriptionRow[],
  reminderId: ReminderId
): Promise<{ sent: number; failed: number; lastEndpoint: string | null; lastError: string | null }> {
  const copy = REMINDER_COPY[reminderId];
  const payload = JSON.stringify({
    title: copy.title,
    body: copy.body,
    data: { url: copy.url, reminderId },
  });

  let sent = 0;
  let failed = 0;
  let lastEndpoint: string | null = null;
  let lastError: string | null = null;

  for (const subscription of subscriptions) {
    lastEndpoint = subscription.endpoint;
    try {
      await webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth,
          },
        },
        payload
      );
      sent += 1;
    } catch (error) {
      failed += 1;
      lastError =
        error instanceof Error ? error.message : "Push delivery failed";
      console.error(
        "[send-notifications] push failed",
        subscription.endpoint,
        lastError
      );
    }
  }

  return { sent, failed, lastEndpoint, lastError };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  if (req.method !== "POST" && req.method !== "GET") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  if (!isAuthorized(req)) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY");
  const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY");
  const vapidSubject =
    Deno.env.get("VAPID_SUBJECT") ?? "mailto:true-north@localhost";

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: "Missing Supabase credentials" }, 500);
  }

  if (!vapidPublicKey || !vapidPrivateKey) {
    return jsonResponse({ error: "Missing VAPID keys" }, 500);
  }

  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const now = new Date();

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, timezone, notification_preferences");

  if (profilesError) {
    return jsonResponse(
      { error: "Failed to load profiles", detail: profilesError.message },
      500
    );
  }

  const { data: subscriptions, error: subscriptionsError } = await supabase
    .from("push_subscriptions")
    .select("id, user_id, endpoint, p256dh, auth");

  if (subscriptionsError) {
    return jsonResponse(
      {
        error: "Failed to load push subscriptions",
        detail: subscriptionsError.message,
      },
      500
    );
  }

  const subscriptionsByUser = new Map<string, PushSubscriptionRow[]>();
  for (const row of (subscriptions ?? []) as PushSubscriptionRow[]) {
    const list = subscriptionsByUser.get(row.user_id) ?? [];
    list.push(row);
    subscriptionsByUser.set(row.user_id, list);
  }

  const summary = {
    checkedUsers: 0,
    dueReminders: 0,
    sent: 0,
    skippedCompleted: 0,
    skippedNoSubscription: 0,
    skippedAlreadyLogged: 0,
    failed: 0,
  };

  for (const profile of (profiles ?? []) as ProfileRow[]) {
    summary.checkedUsers += 1;

    const settings = profile.notification_preferences ?? {};
    const local = getLocalParts(now, profile.timezone ?? "UTC");
    const userSubs = subscriptionsByUser.get(profile.id) ?? [];

    for (const reminderId of REMINDER_IDS) {
      const preference = settings[reminderId];
      if (!preference || !isReminderDue(reminderId, preference, local)) {
        continue;
      }

      summary.dueReminders += 1;
      const periodKey = periodKeyFor(reminderId, local);

      if (await wasAlreadyHandled(supabase, profile.id, reminderId, periodKey)) {
        summary.skippedAlreadyLogged += 1;
        continue;
      }

      if (await isReminderCompleted(supabase, profile.id, reminderId, local)) {
        await writeLog(supabase, {
          user_id: profile.id,
          reminder_id: reminderId,
          period_key: periodKey,
          status: "skipped_completed",
        });
        summary.skippedCompleted += 1;
        continue;
      }

      if (userSubs.length === 0) {
        await writeLog(supabase, {
          user_id: profile.id,
          reminder_id: reminderId,
          period_key: periodKey,
          status: "failed",
          error: "No push subscription",
        });
        summary.skippedNoSubscription += 1;
        summary.failed += 1;
        continue;
      }

      const result = await sendPushToSubscriptions(userSubs, reminderId);

      if (result.sent > 0) {
        await writeLog(supabase, {
          user_id: profile.id,
          reminder_id: reminderId,
          period_key: periodKey,
          status: "sent",
          endpoint: result.lastEndpoint,
        });
        summary.sent += 1;
      } else {
        await writeLog(supabase, {
          user_id: profile.id,
          reminder_id: reminderId,
          period_key: periodKey,
          status: "failed",
          endpoint: result.lastEndpoint,
          error: result.lastError ?? "Push delivery failed",
        });
        summary.failed += 1;
      }
    }
  }

  return jsonResponse({
    ok: true,
    ranAt: now.toISOString(),
    ...summary,
  });
});
