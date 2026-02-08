import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export default function Card({ children, title, className = "" }: CardProps) {
  return (
    <div
      className={`bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-6 ${className}`}
    >
      {title && (
        <h2 className="text-lg font-semibold text-slate-100 mb-4">{title}</h2>
      )}
      {children}
    </div>
  );
}
