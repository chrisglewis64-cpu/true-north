import type {
  AlignmentDirection,
  IdentityInsightFocus,
} from "@/lib/identity-insight/types";

/**
 * Coaching library — positive, constructive, action-oriented.
 * Never shameful, guilty, or punitive.
 */
export const INSIGHT_LIBRARY: Record<
  IdentityInsightFocus,
  Record<AlignmentDirection, readonly string[]>
> = {
  morning_commitment: {
    improving: [
      "Every commitment honoured strengthens your character.",
      "Your morning commitment continues to anchor your identity.",
      "Honouring today's intent is reinforcing who you are becoming.",
    ],
    stable: [
      "Protect tomorrow's Morning Commitment — it sets your bearing.",
      "Hold your course by returning to today's intent with clarity.",
      "Small disciplined actions protect your direction.",
    ],
    falling: [
      "Returning to your daily commitment will quickly restore direction.",
      "Set tomorrow's Morning Commitment and reclaim your bearing.",
      "One clear commitment tomorrow begins correcting your course.",
    ],
  },
  evidence: {
    improving: [
      "Evidence is confirming your growth.",
      "The proof you record is making your standards real.",
      "Your actions continue to reflect the person you intend to become.",
    ],
    stable: [
      "Record one piece of evidence today to keep your Standard visible.",
      "Continue living your standards today — evidence makes them lasting.",
      "Small disciplined actions protect your direction.",
    ],
    falling: [
      "Recording evidence today will strengthen alignment.",
      "Capture one proof of your Standard — it restores clarity fast.",
      "One intentional action can begin correcting your course.",
    ],
  },
  debrief: {
    improving: [
      "Daily consistency is reinforcing your standards.",
      "Reflection is sharpening your direction.",
      "You are building trust with yourself through disciplined action.",
    ],
    stable: [
      "Complete today's debrief to keep your bearing true.",
      "Stay consistent. Character is built one day at a time.",
      "Hold your course.",
    ],
    falling: [
      "Completing today's debrief will strengthen alignment.",
      "A short evening reflection will quickly restore direction.",
      "Small corrections today prevent major drift tomorrow.",
    ],
  },
  mission: {
    improving: [
      "Mission completion is strengthening your identity.",
      "Progress on your mission is reinforcing who you are becoming.",
      "Your standards are becoming habits.",
    ],
    stable: [
      "Take the next meaningful step on your mission today.",
      "Keep your bearing — one deliberate mission action is enough.",
      "Continue living your standards today.",
    ],
    falling: [
      "Your mission needs one meaningful step today to restore direction.",
      "One intentional action on your mission can begin correcting your course.",
      "Your standards need renewed attention today — start with the next right step.",
    ],
  },
  all_strong: {
    improving: [
      "Your actions continue to reflect the person you intend to become.",
      "Every commitment honoured strengthens your character.",
      "Consistency is becoming character.",
      "You are building trust with yourself through disciplined action.",
      "Your standards are becoming habits.",
      "Mission completion is strengthening your identity.",
      "Daily consistency is reinforcing your standards.",
      "Evidence is confirming your growth.",
    ],
    stable: [
      "Stay consistent. Character is built one day at a time.",
      "Small disciplined actions protect your direction.",
      "Continue living your standards today.",
      "Hold your course.",
      "Keep your bearing.",
    ],
    falling: [
      "Recent inconsistency has introduced slight drift.",
      "One intentional action can begin correcting your course.",
      "Small corrections today prevent major drift tomorrow.",
      "Returning to your daily rhythm will quickly restore direction.",
    ],
  },
  establishing: {
    improving: [
      "Begin with today's Morning Commitment — alignment follows consistent action.",
      "Your first deliberate actions will establish your bearing.",
      "Set your Standard in motion today.",
    ],
    stable: [
      "Begin with today's Morning Commitment — alignment follows consistent action.",
      "Complete one intentional action today to establish your bearing.",
      "Your Compass will speak clearly as you live your Standard.",
    ],
    falling: [
      "Begin with today's Morning Commitment — alignment follows consistent action.",
      "One intentional action today will start establishing your direction.",
      "Return to your Standard with one clear commitment.",
    ],
  },
};
