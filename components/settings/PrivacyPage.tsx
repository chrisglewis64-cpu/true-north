import { ContentPageShell } from "@/components/settings/ContentPageShell";

export function PrivacyPage() {
  return (
    <ContentPageShell label="Privacy" title="Privacy Policy">
      <div className="space-y-6 text-[15px] leading-relaxed text-muted sm:text-base">
        <p>
          True North stores the identity data you create — standards, missions,
          bearings, daily commitments, debriefs, and evidence — so you can
          return to your operating system each day.
        </p>
        <p>
          Your account credentials and profile are handled through our
          authentication provider. We do not sell your personal data.
        </p>
        <p>
          Evidence and debriefs are private to your account. They exist as your
          service record of who you are becoming.
        </p>
        <p>
          For questions about privacy during beta, use Provide Feedback in
          Settings.
        </p>
      </div>
    </ContentPageShell>
  );
}
