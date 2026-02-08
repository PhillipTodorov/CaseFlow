import type { FormField } from "../types";

export interface ValidationErrors {
  [fieldId: string]: string;
}

export function validateField(
  field: FormField,
  value: unknown,
  allAnswers: Record<string, unknown>
): string | null {
  // Skip validation if field is not visible
  if (field.visibleWhen && !field.visibleWhen(allAnswers)) {
    return null;
  }

  const isRequired =
    typeof field.required === "function"
      ? field.required(allAnswers)
      : field.required;

  // Required check
  if (isRequired) {
    if (value === undefined || value === null || value === "") {
      return `${field.label} is required`;
    }
    if (Array.isArray(value) && value.length === 0) {
      return "Please select at least one option";
    }
    if (field.type === "checkbox" && value !== true) {
      return "You must confirm this";
    }
  }

  // Skip further validation if empty and not required
  if (!value || (typeof value === "string" && value.trim() === "")) {
    return null;
  }

  // Pattern validation
  if (field.validation?.pattern && typeof value === "string") {
    if (!field.validation.pattern.test(value)) {
      return field.validation.patternMessage || "Invalid format";
    }
  }

  // Min length validation
  if (field.validation?.minLength && typeof value === "string") {
    if (value.length < field.validation.minLength) {
      return `Must be at least ${field.validation.minLength} characters`;
    }
  }

  // Date not in future
  if (field.type === "date" && typeof value === "string" && value) {
    const date = new Date(value);
    if (date > new Date()) {
      return "Date cannot be in the future";
    }
  }

  // Number range
  if (field.type === "number") {
    const numValue = typeof value === "string" ? Number(value) : value;
    if (typeof numValue === "number" && !isNaN(numValue)) {
      if (
        field.validation?.min !== undefined &&
        numValue < field.validation.min
      ) {
        return `Must be at least ${field.validation.min}`;
      }
      if (
        field.validation?.max !== undefined &&
        numValue > field.validation.max
      ) {
        return `Must be no more than ${field.validation.max}`;
      }
    }
  }

  return null;
}

export function validateSection(
  sectionId: string,
  fields: FormField[],
  answers: Record<string, unknown>
): ValidationErrors {
  const errors: ValidationErrors = {};
  const sectionFields = fields.filter((f) => f.section === sectionId);
  for (const field of sectionFields) {
    const error = validateField(field, answers[field.id], answers);
    if (error) {
      errors[field.id] = error;
    }
  }
  return errors;
}
