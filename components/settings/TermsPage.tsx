import { ContentPageShell } from "@/components/settings/ContentPageShell";

export function TermsPage() {
  return (
    <ContentPageShell label="Terms" title="Terms">
      <div className="space-y-6 text-[15px] leading-relaxed text-muted sm:text-base">
        <p>
          True North is provided as a personal operating system for intentional
          living. You are responsible for the standards you set and the actions
          you take.
        </p>
        <p>
          The application is offered in beta. Features may change. Availability
          is not guaranteed.
        </p>
        <p>
          By using True North you agree to use it for lawful personal purposes
          and to treat your own data with integrity.
        </p>
        <p>Keep heading North.</p>
      </div>
    </ContentPageShell>
  );
}
