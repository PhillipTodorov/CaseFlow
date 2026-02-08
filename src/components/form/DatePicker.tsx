interface DatePickerProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  description?: string;
  required?: boolean;
  maxToday?: boolean;
}

export default function DatePicker({
  id,
  label,
  value,
  onChange,
  error,
  description,
  required,
  maxToday = true,
}: DatePickerProps) {
  const descId = description ? `${id}-desc` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descId, errorId].filter(Boolean).join(" ") || undefined;
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-300"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {description && (
        <p id={descId} className="text-xs text-slate-400">
          {description}
        </p>
      )}
      <input
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={describedBy}
        aria-invalid={!!error}
        aria-required={required}
        max={maxToday ? today : undefined}
        className={`
          w-full px-3 py-2 rounded-lg border text-sm min-h-[44px]
          transition-colors bg-slate-800 text-slate-100
          ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              : "border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          }
        `}
      />
      {error && (
        <p id={errorId} className="text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
