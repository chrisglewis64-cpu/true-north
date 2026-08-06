type RadioOptionProps = {
  name: string;
  label: "Yes" | "No";
  value: "yes" | "no";
  checked: boolean;
  onChange: (value: "yes" | "no") => void;
};

export function RadioOption({
  name,
  label,
  value,
  checked,
  onChange,
}: RadioOptionProps) {
  return (
    <label
      className={`flex flex-1 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
        checked
          ? "border-accent/50 bg-accent-glow"
          : "border-border bg-surface-elevated hover:border-border-subtle"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="h-4 w-4 accent-[var(--accent)]"
      />
      <span
        className={`text-[15px] font-medium ${
          checked ? "text-accent" : "text-foreground/90"
        }`}
      >
        {label}
      </span>
    </label>
  );
}
