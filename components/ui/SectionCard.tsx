type SectionCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function SectionCard({ children, className = "" }: SectionCardProps) {
  return (
    <section
      className={`rounded-2xl border border-border bg-surface p-5 sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

type SectionLabelProps = {
  children: React.ReactNode;
};

export function SectionLabel({ children }: SectionLabelProps) {
  return (
    <p className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
      {children}
    </p>
  );
}
