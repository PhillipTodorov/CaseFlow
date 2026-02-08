interface TextareaProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  description?: string;
  required?: boolean;
  rows?: number;
  placeholder?: string;
}

export default function Textarea({
  id,
  label,
  value,
  onChange,
  error,
  description,
  required,
  rows = 3,
  placeholder,
}: TextareaProps) {
  const descId = description ? `${id}-desc` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descId, errorId].filter(Boolean).join(" ") || undefined;

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
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={describedBy}
        aria-invalid={!!error}
        aria-required={required}
        rows={rows}
        placeholder={placeholder}
        className={`
          w-full px-3 py-2 rounded-lg border text-sm
          transition-colors resize-vertical bg-slate-800 text-slate-100
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
