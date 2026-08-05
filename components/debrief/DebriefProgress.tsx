type DebriefProgressProps = {
  step: 1 | 2 | 3 | 4;
};

const steps = [1, 2, 3, 4] as const;

export function DebriefProgress({ step }: DebriefProgressProps) {
  return (
    <div
      className="flex items-center justify-center gap-2"
      aria-label={`Step ${step} of 4`}
    >
      {steps.map((value) => (
        <span
          key={value}
          className={`h-1.5 rounded-full transition-all ${
            value === step
              ? "w-6 bg-accent"
              : value < step
                ? "w-1.5 bg-accent/50"
                : "w-1.5 bg-border-subtle"
          }`}
        />
      ))}
    </div>
  );
}
