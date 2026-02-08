import type { Priority, CaseStatus } from "../../types";

interface BadgeProps {
  type: "priority" | "status";
  value: string;
}

const priorityStyles: Record<Priority, string> = {
  low: "bg-slate-700 text-slate-300",
  medium: "bg-amber-900/60 text-amber-300",
  high: "bg-orange-900/60 text-orange-300",
  urgent: "bg-red-900/60 text-red-300",
};

const priorityLabels: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

const statusStyles: Record<CaseStatus, string> = {
  new: "bg-blue-900/60 text-blue-300",
  triaged: "bg-purple-900/60 text-purple-300",
  assigned: "bg-indigo-900/60 text-indigo-300",
  in_progress: "bg-cyan-900/60 text-cyan-300",
  closed: "bg-slate-700 text-slate-400",
};

const statusLabels: Record<CaseStatus, string> = {
  new: "New",
  triaged: "Triaged",
  assigned: "Assigned",
  in_progress: "In Progress",
  closed: "Closed",
};

export default function Badge({ type, value }: BadgeProps) {
  const styles =
    type === "priority"
      ? priorityStyles[value as Priority] || ""
      : statusStyles[value as CaseStatus] || "";
  const label =
    type === "priority"
      ? priorityLabels[value as Priority] || value
      : statusLabels[value as CaseStatus] || value;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles}`}
    >
      {label}
    </span>
  );
}
