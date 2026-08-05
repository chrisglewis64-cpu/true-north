type ValidationMessageProps = {
  message?: string;
  id?: string;
};

export function ValidationMessage({ message, id }: ValidationMessageProps) {
  if (!message) return null;

  return (
    <p
      id={id}
      role="alert"
      className="mt-2 font-mono text-[11px] leading-relaxed text-amber-400/90"
    >
      {message}
    </p>
  );
}

type ValidationSummaryProps = {
  message?: string;
};

export function ValidationSummary({ message }: ValidationSummaryProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="mb-4 rounded-xl border border-amber-500/25 bg-amber-500/5 px-4 py-3"
    >
      <p className="font-mono text-[11px] leading-relaxed text-amber-400/90">
        {message}
      </p>
    </div>
  );
}

export function fieldErrorClass(hasError: boolean): string {
  return hasError
    ? "border-amber-500/40 focus:border-amber-500/50 ring-1 ring-amber-500/15"
    : "border-border focus:border-accent/50";
}

export function cardErrorClass(hasError: boolean): string {
  return hasError ? "border-amber-500/40 ring-1 ring-amber-500/10" : "border-border";
}
