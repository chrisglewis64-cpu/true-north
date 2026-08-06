import { SectionLabel } from "@/components/ui/SectionCard";

type ReviewSectionProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

export function ReviewSection({
  label,
  children,
  className = "",
}: ReviewSectionProps) {
  return (
    <section className={className}>
      <SectionLabel>{label}</SectionLabel>
      {children}
    </section>
  );
}

type ReviewProseProps = {
  children: React.ReactNode;
  className?: string;
};

export function ReviewProse({ children, className = "" }: ReviewProseProps) {
  return (
    <p
      className={`text-[15px] leading-relaxed text-foreground/90 sm:text-base ${className}`}
    >
      {children}
    </p>
  );
}

type ReviewListProps = {
  items: string[];
  ordered?: boolean;
};

export function ReviewList({ items, ordered = false }: ReviewListProps) {
  const Tag = ordered ? "ol" : "ul";

  return (
    <Tag
      className={`space-y-3 ${ordered ? "list-decimal pl-5" : "list-none pl-0"}`}
    >
      {items.map((item) => (
        <li
          key={item}
          className={`text-[15px] leading-relaxed text-foreground/90 sm:text-base ${
            ordered ? "" : "flex gap-3"
          }`}
        >
          {!ordered && (
            <span className="shrink-0 text-muted" aria-hidden>
              •
            </span>
          )}
          <span>{item}</span>
        </li>
      ))}
    </Tag>
  );
}
