import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SECTIONS, FIELDS } from "../data/formConfig";
import { useCases } from "../context/CaseContext";
import { useAutoSave } from "../hooks/useAutoSave";
import { loadDraft, clearDraft } from "../utils/storage";
import { validateSection, type ValidationErrors } from "../utils/validation";
import { getResponseTimeframe } from "../utils/triage";
import type { Case } from "../types";
import ProgressBar from "../components/layout/ProgressBar";
import FieldRenderer from "../components/form/FieldRenderer";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Alert from "../components/ui/Alert";

type IntakeView = "form" | "draft-prompt" | "result";

export default function Intake() {
  const navigate = useNavigate();
  const { addCase } = useCases();

  const [view, setView] = useState<IntakeView>("form");
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(
    new Set()
  );
  const [submittedCase, setSubmittedCase] = useState<Case | null>(null);

  const { lastSaved, isSaving } = useAutoSave(answers);

  // Check for saved draft on mount
  useEffect(() => {
    const draft = loadDraft();
    if (draft && Object.keys(draft).length > 0) {
      setView("draft-prompt");
    }
  }, []);

  const resumeDraft = () => {
    const draft = loadDraft();
    if (draft) {
      setAnswers(draft);
    }
    setView("form");
  };

  const startFresh = () => {
    clearDraft();
    setAnswers({});
    setView("form");
  };

  const currentSection = SECTIONS[currentStep];
  const sectionFields = FIELDS.filter(
    (f) => f.section === currentSection.id
  );
  const visibleFields = sectionFields.filter(
    (f) => !f.visibleWhen || f.visibleWhen(answers)
  );

  const handleFieldChange = useCallback(
    (fieldId: string, value: unknown) => {
      setAnswers((prev) => ({ ...prev, [fieldId]: value }));
      // Clear error for this field when user changes it
      setErrors((prev) => {
        if (prev[fieldId]) {
          const next = { ...prev };
          delete next[fieldId];
          return next;
        }
        return prev;
      });
    },
    []
  );

  const validateCurrentSection = (): boolean => {
    const sectionErrors = validateSection(
      currentSection.id,
      FIELDS,
      answers
    );
    setErrors(sectionErrors);
    return Object.keys(sectionErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateCurrentSection()) {
      // Scroll to first error
      const firstErrorId = Object.keys(
        validateSection(currentSection.id, FIELDS, answers)
      )[0];
      if (firstErrorId) {
        document.getElementById(firstErrorId)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    setErrors({});

    if (currentStep < SECTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setErrors({});
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleStepClick = (index: number) => {
    if (completedSteps.has(index) || index === currentStep) {
      setErrors({});
      setCurrentStep(index);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSaveAndExit = () => {
    // Auto-save will handle persisting the current state
    navigate("/");
  };

  const handleSubmit = () => {
    // Validate all sections
    let hasErrors = false;
    let firstErrorStep = -1;

    for (let i = 0; i < SECTIONS.length; i++) {
      const sectionErrors = validateSection(
        SECTIONS[i].id,
        FIELDS,
        answers
      );
      if (Object.keys(sectionErrors).length > 0) {
        hasErrors = true;
        if (firstErrorStep === -1) {
          firstErrorStep = i;
          setErrors(sectionErrors);
        }
      }
    }

    if (hasErrors) {
      setCurrentStep(firstErrorStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Submit the case
    const newCase = addCase(answers);
    clearDraft();
    setSubmittedCase(newCase);
    setView("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Draft prompt view
  if (view === "draft-prompt") {
    return (
      <main id="main" className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <h1 className="text-xl font-semibold text-slate-100 mb-4">
            Saved Draft Found
          </h1>
          <p className="text-slate-400 mb-6">
            You have an unfinished referral. Would you like to continue where
            you left off?
          </p>
          <div className="flex gap-3">
            <Button onClick={resumeDraft}>Resume Draft</Button>
            <Button variant="secondary" onClick={startFresh}>
              Start Fresh
            </Button>
          </div>
        </Card>
      </main>
    );
  }

  // Result view after submission
  if (view === "result" && submittedCase) {
    const responseTime = getResponseTimeframe(submittedCase.priority);

    return (
      <main id="main" className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">&#10003;</span>
            </div>
            <h1 className="text-xl font-semibold text-slate-100">
              Referral Submitted
            </h1>
            <p className="text-slate-400 mt-1">
              {submittedCase.client.fullName}
            </p>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4 mb-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">
                Priority
              </span>
              <Badge type="priority" value={submittedCase.priority} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">
                Triage Score
              </span>
              <span className="text-sm font-semibold text-slate-100">
                {submittedCase.triageScore} / 100
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">
                Response Timeframe
              </span>
              <span className="text-sm font-semibold text-slate-100">
                {responseTime}
              </span>
            </div>
          </div>

          {submittedCase.flags.length > 0 && (
            <div className="space-y-2 mb-6">
              {submittedCase.flags.map((flag) => (
                <Alert key={flag} type="warning">
                  {flag}
                </Alert>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={() => navigate(`/cases/${submittedCase.id}`)}
            >
              View Case Details
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setAnswers({});
                setCurrentStep(0);
                setCompletedSteps(new Set());
                setErrors({});
                setSubmittedCase(null);
                setView("form");
              }}
            >
              Submit Another Referral
            </Button>
          </div>
        </Card>
      </main>
    );
  }

  // Main form view
  const isLastStep = currentStep === SECTIONS.length - 1;

  return (
    <main id="main" className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100 mb-1">
          New Referral
        </h1>
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">
            Step {currentStep + 1} of {SECTIONS.length}
          </p>
          <p className="text-xs text-slate-400" aria-live="polite">
            {isSaving
              ? "Saving..."
              : lastSaved
              ? `Saved at ${lastSaved.toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : ""}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <ProgressBar
          sections={SECTIONS}
          currentIndex={currentStep}
          onStepClick={handleStepClick}
          completedSections={completedSteps}
        />
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-slate-100 mb-1">
          {currentSection.title}
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          {currentSection.description}
        </p>

        <div className="space-y-5">
          {visibleFields.map((field) => (
            <FieldRenderer
              key={field.id}
              field={field}
              value={answers[field.id]}
              onChange={(value) => handleFieldChange(field.id, value)}
              error={errors[field.id]}
            />
          ))}
        </div>

        {Object.keys(errors).length > 0 && (
          <div className="mt-4">
            <Alert type="error">
              Please correct the errors above before continuing.
            </Alert>
          </div>
        )}

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-700">
          <div>
            {currentStep > 0 && (
              <Button variant="secondary" onClick={handleBack}>
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={handleSaveAndExit}>
              Save &amp; Exit
            </Button>
            {isLastStep ? (
              <Button onClick={handleSubmit}>Submit Referral</Button>
            ) : (
              <Button onClick={handleContinue}>Continue</Button>
            )}
          </div>
        </div>
      </Card>
    </main>
  );
}
