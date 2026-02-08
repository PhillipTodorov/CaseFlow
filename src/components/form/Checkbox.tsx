interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  description?: string;
  required?: boolean;
}

export default function Checkbox({
  id,
  label,
  checked,
  onChange,
  error,
  description,
  required,
}: CheckboxProps) {
  const descId = description ? `${id}-desc` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="space-y-1">
      <label className="flex items-start gap-3 cursor-pointer min-h-[44px] py-2">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-describedby={describedBy}
          aria-invalid={!!error}
          aria-required={required}
          className="mt-0.5 w-4 h-4 text-blue-500 border-slate-600 rounded focus:ring-blue-500 bg-slate-800"
        />
        <span className="text-sm text-slate-300">
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-hidden="true">
              *
            </span>
          )}
        </span>
      </label>
      {description && (
        <p id={descId} className="text-xs text-slate-400 ml-7">
          {description}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs text-red-400 ml-7" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
