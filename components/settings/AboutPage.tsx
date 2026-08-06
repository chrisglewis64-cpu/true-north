import { ContentPageShell } from "@/components/settings/ContentPageShell";

const paragraphs = [
  "True North exists to help people become the person they said they wanted to become.",
  "Not through motivation.",
  "Not through productivity.",
  "Through daily alignment between identity and action.",
  "Every morning you recommit.",
  "Every evening you provide evidence.",
  "Small disciplined actions become character.",
  "The Compass does not measure achievement.",
  "It measures alignment.",
  "The closer you move toward True North, the more closely your actions reflect your standards.",
  "This application is intentionally different.",
  "It is designed for people who choose deliberate living over passive living.",
  "If you are prepared to take ownership of your life every day, welcome.",
] as const;

export function AboutPage() {
  return (
    <ContentPageShell label="About True North" title="About True North">
      <div className="space-y-6 text-[17px] leading-relaxed text-foreground/90 sm:text-lg">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </ContentPageShell>
  );
}
