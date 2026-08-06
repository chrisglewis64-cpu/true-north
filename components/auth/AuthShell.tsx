import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

/**
 * Shared calm shell for authentication entry points.
 */
export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 pb-10 pt-12 sm:max-w-xl sm:px-8 sm:pt-16 lg:max-w-2xl lg:pt-20">
        <header className="animate-fade-in">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
            True North
          </p>
          <h1 className="mt-8 text-[2.5rem] font-semibold leading-[1.08] tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-muted">
            {subtitle}
          </p>
        </header>

        <div className="mt-10 animate-fade-in [animation-delay:80ms]">
          {children}
        </div>
      </main>
    </div>
  );
}
