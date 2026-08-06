import { getIdentityMessage } from "@/lib/identity-alignment/messaging";

export type GuidanceOptions = {
  /**
   * Stable seed for message rotation within a category.
   * Defaults to today's date so messaging stays consistent through the day.
   */
  rotationSeed?: string;
};

function defaultRotationSeed(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Returns one identity-centred message for the given Identity Alignment value.
 */
export function getGuidanceFromAlignment(
  alignment: number,
  options: GuidanceOptions = {}
): string {
  return getIdentityMessage(
    alignment,
    options.rotationSeed ?? defaultRotationSeed()
  );
}

export const GUIDANCE_MESSAGE_COUNT = 3;
