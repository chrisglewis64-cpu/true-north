import Link from "next/link";

type SettingsLinkRowProps = {
  href: string;
  label: string;
  external?: boolean;
};

export function SettingsLinkRow({
  href,
  label,
  external = false,
}: SettingsLinkRowProps) {
  const className =
    "flex items-center justify-between gap-4 border-b border-border py-4 text-[15px] text-foreground/90 transition-colors last:border-0 hover:text-foreground";

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        <span>{label}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          →
        </span>
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      <span>{label}</span>
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
        →
      </span>
    </Link>
  );
}
