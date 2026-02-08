import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import type { Case, CaseAction, Note } from "../types";
import { loadCases, saveCases } from "../utils/storage";
import { triageCase } from "../utils/triage";
import { generateId, nowISO } from "../utils/dates";

interface CaseState {
  cases: Case[];
  isLoaded: boolean;
}

interface CaseContextType extends CaseState {
  dispatch: React.Dispatch<CaseAction>;
  addCase: (formData: Record<string, unknown>) => Case;
  updateCaseStatus: (
    id: string,
    status: Case["status"],
    assignedTo?: string
  ) => void;
  addNote: (caseId: string, content: string, createdBy?: string) => void;
  closeCase: (id: string, outcome: Case["outcome"]) => void;
  getCaseById: (id: string) => Case | undefined;
}

function caseReducer(state: CaseState, action: CaseAction): CaseState {
  switch (action.type) {
    case "LOAD_CASES":
      return { ...state, cases: action.payload, isLoaded: true };
    case "ADD_CASE":
      return { ...state, cases: [action.payload, ...state.cases] };
    case "UPDATE_CASE":
      return {
        ...state,
        cases: state.cases.map((c) =>
          c.id === action.payload.id
            ? { ...c, ...action.payload.updates, updatedAt: nowISO() }
            : c
        ),
      };
    case "DELETE_CASE":
      return {
        ...state,
        cases: state.cases.filter((c) => c.id !== action.payload),
      };
    case "ADD_NOTE":
      return {
        ...state,
        cases: state.cases.map((c) =>
          c.id === action.payload.caseId
            ? {
                ...c,
                notes: [...c.notes, action.payload.note],
                updatedAt: nowISO(),
              }
            : c
        ),
      };
    case "CLEAR_ALL":
      return { ...state, cases: [] };
    default:
      return state;
  }
}

const CaseContext = createContext<CaseContextType | null>(null);

export function CaseProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(caseReducer, {
    cases: [],
    isLoaded: false,
  });

  // Load from localStorage on mount
  useEffect(() => {
    dispatch({ type: "LOAD_CASES", payload: loadCases() });
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    if (state.isLoaded) {
      saveCases(state.cases);
    }
  }, [state.cases, state.isLoaded]);

  const addCase = (formData: Record<string, unknown>): Case => {
    const caseData = formAnswersToCase(formData);
    const { score, priority, flags } = triageCase(caseData);
    const finalCase: Case = {
      ...caseData,
      triageScore: score,
      priority,
      flags,
      status: flags.length > 0 ? "triaged" : "new",
    };
    dispatch({ type: "ADD_CASE", payload: finalCase });
    return finalCase;
  };

  const updateCaseStatus = (
    id: string,
    status: Case["status"],
    assignedTo?: string
  ) => {
    const updates: Partial<Case> = { status };
    if (assignedTo !== undefined) updates.assignedTo = assignedTo;
    dispatch({ type: "UPDATE_CASE", payload: { id, updates } });
  };

  const addNote = (caseId: string, content: string, createdBy?: string) => {
    const note: Note = {
      id: generateId(),
      content,
      createdAt: nowISO(),
      createdBy,
    };
    dispatch({ type: "ADD_NOTE", payload: { caseId, note } });
  };

  const closeCase = (id: string, outcome: Case["outcome"]) => {
    dispatch({
      type: "UPDATE_CASE",
      payload: { id, updates: { status: "closed", outcome } },
    });
  };

  const getCaseById = (id: string) => state.cases.find((c) => c.id === id);

  return (
    <CaseContext.Provider
      value={{
        ...state,
        dispatch,
        addCase,
        updateCaseStatus,
        addNote,
        closeCase,
        getCaseById,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
}

export function useCases() {
  const context = useContext(CaseContext);
  if (!context) throw new Error("useCases must be used within CaseProvider");
  return context;
}

// Convert flat dot-notation answers to nested Case structure
function formAnswersToCase(answers: Record<string, unknown>): Case {
  const now = nowISO();
  const result: Record<string, unknown> = {
    id: generateId(),
    status: "new" as const,
    priority: "low" as const,
    triageScore: 0,
    flags: [],
    client: {
      fullName: "",
      dateOfBirth: "",
      preferredContact: "phone",
      communicationNeeds: [],
    },
    referral: {
      source: "self",
      dateReceived: "",
      reasons: [],
      supportRequested: "",
    },
    risk: {
      riskToSelf: "none",
      riskToOthers: "none",
      riskFromOthers: "none",
      childrenInHousehold: false,
      safeguardingConcerns: false,
      urgency: "routine",
    },
    consent: {
      shareInformation: false,
      contactClient: false,
      preferredTimes: [],
    },
    notes: [],
    createdAt: now,
    updatedAt: now,
  };

  for (const [key, value] of Object.entries(answers)) {
    const parts = key.split(".");
    if (parts.length === 2) {
      const [section, field] = parts;
      if (typeof result[section] === "object" && result[section] !== null) {
        let finalValue = value;
        if (value === "true") finalValue = true;
        if (value === "false") finalValue = false;
        (result[section] as Record<string, unknown>)[field] = finalValue;
      }
    }
  }

  return result as unknown as Case;
}
