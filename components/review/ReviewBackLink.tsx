import Link from "next/link";

type ReviewBackLinkProps = {
  href?: string;
};

export function ReviewBackLink({ href = "/review" }: ReviewBackLinkProps) {
  return (
    <Link
      href={href}
      className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
    >
      ← Back
    </Link>
  );
}
