import type { ReactNode } from "react";

interface AlertProps {
  type: "info" | "warning" | "error" | "success";
  children: ReactNode;
  className?: string;
}

const alertStyles = {
  info: "bg-blue-900/30 border-blue-800 text-blue-300",
  warning: "bg-amber-900/30 border-amber-800 text-amber-300",
  error: "bg-red-900/30 border-red-800 text-red-300",
  success: "bg-green-900/30 border-green-800 text-green-300",
};

const icons = {
  info: "\u2139\uFE0F",
  warning: "\u26A0\uFE0F",
  error: "\u274C",
  success: "\u2705",
};

export default function Alert({
  type,
  children,
  className = "",
}: AlertProps) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className={`flex items-start gap-3 p-4 rounded-lg border ${alertStyles[type]} ${className}`}
    >
      <span className="flex-shrink-0" aria-hidden="true">
        {icons[type]}
      </span>
      <div className="text-sm">{children}</div>
    </div>
  );
}
