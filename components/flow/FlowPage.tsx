import Link from "next/link";

type FlowPageProps = {
  title: string;
  nextPath: string;
  nextLabel: string;
};

export function FlowPage({ title, nextPath, nextLabel }: FlowPageProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-6 sm:max-w-xl sm:px-8">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
          True North
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
      </main>

      <footer className="px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4 sm:px-8">
        <div className="mx-auto w-full max-w-lg sm:max-w-xl">
          <Link
            href={nextPath}
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-accent font-mono text-sm font-medium uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90 active:opacity-80 sm:h-16 sm:text-[15px]"
          >
            {nextLabel}
          </Link>
        </div>
      </footer>
    </div>
  );
}
