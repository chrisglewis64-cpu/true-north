type FieldLabelProps = {
  htmlFor?: string;
  children: React.ReactNode;
};

export function FieldLabel({ htmlFor, children }: FieldLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted"
    >
      {children}
    </label>
  );
}

const fieldClassName =
  "w-full rounded-xl border border-border bg-surface-elevated px-4 py-3 text-[15px] text-foreground focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50";

type SelectFieldProps = {
  id: string;
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  options: { value: string | number; label: string; disabled?: boolean }[];
  disabled?: boolean;
};

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  disabled,
}: SelectFieldProps) {
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClassName}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

type TimeFieldProps = {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function TimeField({
  id,
  label = "Time",
  value,
  onChange,
  disabled,
}: TimeFieldProps) {
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input
        id={id}
        type="time"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClassName}
      />
    </div>
  );
}
