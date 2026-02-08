import type { FormSection } from "../../types";

interface ProgressBarProps {
  sections: FormSection[];
  currentIndex: number;
  onStepClick: (index: number) => void;
  completedSections: Set<number>;
}

export default function ProgressBar({
  sections,
  currentIndex,
  onStepClick,
  completedSections,
}: ProgressBarProps) {
  return (
    <nav aria-label="Form progress">
      <ol className="flex items-center w-full">
        {sections.map((section, index) => {
          const isCompleted = completedSections.has(index);
          const isCurrent = index === currentIndex;
          const isClickable = isCompleted || isCurrent;

          return (
            <li
              key={section.id}
              className={`flex items-center ${
                index < sections.length - 1 ? "flex-1" : ""
              }`}
            >
              <button
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                aria-current={isCurrent ? "step" : undefined}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                  transition-colors min-h-[44px]
                  ${
                    isCurrent
                      ? "bg-blue-600 text-white"
                      : isCompleted
                      ? "bg-green-900/40 text-green-400 hover:bg-green-900/60"
                      : "bg-slate-700 text-slate-500 cursor-not-allowed"
                  }
                `}
              >
                <span
                  className={`
                    flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
                    ${
                      isCompleted && !isCurrent
                        ? "bg-green-600 text-white"
                        : isCurrent
                        ? "bg-white text-blue-600"
                        : "bg-slate-600 text-slate-400"
                    }
                  `}
                >
                  {isCompleted && !isCurrent ? "\u2713" : index + 1}
                </span>
                <span className="hidden sm:inline">{section.shortTitle}</span>
              </button>
              {index < sections.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    isCompleted ? "bg-green-700" : "bg-slate-700"
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
