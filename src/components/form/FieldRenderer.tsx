import type { FormField } from "../../types";
import TextInput from "./TextInput";
import Select from "./Select";
import RadioGroup from "./RadioGroup";
import Checkbox from "./Checkbox";
import Textarea from "./Textarea";
import DatePicker from "./DatePicker";

interface FieldRendererProps {
  field: FormField;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
}

export default function FieldRenderer({
  field,
  value,
  onChange,
  error,
}: FieldRendererProps) {
  const isRequired =
    typeof field.required === "function" ? false : field.required;

  switch (field.type) {
    case "text":
    case "email":
    case "tel":
      return (
        <TextInput
          id={field.id}
          label={field.label}
          type={field.type}
          value={(value as string) || ""}
          onChange={onChange}
          error={error}
          description={field.description}
          required={isRequired}
        />
      );

    case "number":
      return (
        <TextInput
          id={field.id}
          label={field.label}
          type="number"
          value={value != null ? String(value) : ""}
          onChange={(v) => onChange(v === "" ? "" : v)}
          error={error}
          description={field.description}
          required={isRequired}
          min={field.validation?.min}
          max={field.validation?.max}
        />
      );

    case "select":
      return (
        <Select
          id={field.id}
          label={field.label}
          value={(value as string) || ""}
          onChange={onChange}
          options={field.options || []}
          error={error}
          description={field.description}
          required={isRequired}
        />
      );

    case "radio":
      return (
        <RadioGroup
          id={field.id}
          label={field.label}
          value={(value as string) || ""}
          onChange={onChange}
          options={field.options || []}
          error={error}
          description={field.description}
          required={isRequired}
        />
      );

    case "checkbox":
      return (
        <Checkbox
          id={field.id}
          label={field.label}
          checked={!!value}
          onChange={onChange}
          error={error}
          description={field.description}
          required={isRequired}
        />
      );

    case "textarea":
      return (
        <Textarea
          id={field.id}
          label={field.label}
          value={(value as string) || ""}
          onChange={onChange}
          error={error}
          description={field.description}
          required={isRequired}
        />
      );

    case "date":
      return (
        <DatePicker
          id={field.id}
          label={field.label}
          value={(value as string) || ""}
          onChange={onChange}
          error={error}
          description={field.description}
          required={isRequired}
        />
      );

    case "multiselect":
      return (
        <MultiSelectCheckboxes
          id={field.id}
          label={field.label}
          selectedValues={(value as string[]) || []}
          onChange={onChange}
          options={field.options || []}
          error={error}
          description={field.description}
          required={isRequired}
        />
      );

    default:
      return null;
  }
}

// Inline multiselect component (checkbox group)
function MultiSelectCheckboxes({
  id,
  label,
  selectedValues,
  onChange,
  options,
  error,
  description,
  required,
}: {
  id: string;
  label: string;
  selectedValues: string[];
  onChange: (value: string[]) => void;
  options: { value: string; label: string }[];
  error?: string;
  description?: string;
  required?: boolean;
}) {
  const toggle = (optValue: string) => {
    const next = selectedValues.includes(optValue)
      ? selectedValues.filter((v) => v !== optValue)
      : [...selectedValues, optValue];
    onChange(next);
  };

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
      <div className="space-y-1">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-3 cursor-pointer min-h-[44px] px-3 py-2 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedValues.includes(opt.value)}
              onChange={() => toggle(opt.value)}
              className="w-4 h-4 text-blue-500 border-slate-600 rounded focus:ring-blue-500 bg-slate-800"
            />
            <span className="text-sm text-slate-300">{opt.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
