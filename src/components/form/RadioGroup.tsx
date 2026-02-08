import type { FormFieldOption } from "../../types";

interface RadioGroupProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FormFieldOption[];
  error?: string;
  description?: string;
  required?: boolean;
}

export default function RadioGroup({
  id,
  label,
  value,
  onChange,
  options,
  error,
  description,
  required,
}: RadioGroupProps) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <fieldset className="space-y-2">
      <legend className="block text-sm font-medium text-slate-300">
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-hidden="true">
            *
          </span>
        )}
      </legend>
      {description && (
        <p className="text-xs text-slate-400">{description}</p>
      )}
      <div className="space-y-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-3 cursor-pointer min-h-[44px] px-3 py-2 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors"
          >
            <input
              type="radio"
              name={id}
              value={opt.value}
              checked={value === opt.value}
              onChange={(e) => onChange(e.target.value)}
              aria-invalid={!!error}
              className="w-4 h-4 text-blue-500 border-slate-600 focus:ring-blue-500 bg-slate-800"
            />
            <span className="text-sm text-slate-300">{opt.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p id={errorId} className="text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
