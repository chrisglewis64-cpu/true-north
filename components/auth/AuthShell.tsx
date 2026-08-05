"use client";

import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 py-12 sm:max-w-md sm:px-8">
        <header className="animate-fade-in text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            True North
          </p>
          <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-muted">
              {subtitle}
            </p>
          ) : null}
        </header>

        <div className="mt-10 animate-fade-in [animation-delay:80ms]">
          {children}
        </div>

        {footer ? (
          <div className="mt-8 text-center text-[14px] text-muted">{footer}</div>
        ) : null}
      </main>
    </div>
  );
}

type AuthFieldProps = {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  required?: boolean;
};

export function AuthField({
  id,
  label,
  type = "text",
  value,
  onChange,
  autoComplete,
  required = true,
}: AuthFieldProps) {
  return (
    <label htmlFor={id} className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
        {label}
      </span>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-border bg-surface px-4 py-3.5 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted/60 focus:border-accent/40"
      />
    </label>
  );
}

export function AuthButton({
  children,
  disabled,
  type = "submit",
}: {
  children: ReactNode;
  disabled?: boolean;
  type?: "submit" | "button";
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className="flex h-14 w-full items-center justify-center rounded-2xl bg-accent font-mono text-sm font-medium uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {children}
    </button>
  );
}

export function AuthError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-[14px] text-red-300/90">
      {message}
    </p>
  );
}
