// Case status and priority types
export type CaseStatus =
  | "new"
  | "triaged"
  | "assigned"
  | "in_progress"
  | "closed";
export type Priority = "low" | "medium" | "high" | "urgent";
export type RiskLevel = "none" | "low" | "medium" | "high";
export type UrgencyLevel = "routine" | "soon" | "urgent" | "crisis";
export type ReferralSource =
  | "self"
  | "gp"
  | "hospital"
  | "social_services"
  | "police"
  | "charity"
  | "family"
  | "other";
export type PreferredContact = "phone" | "email" | "text" | "letter";
export type OutcomeType =
  | "engaged"
  | "declined"
  | "referred_on"
  | "no_contact"
  | "not_eligible"
  | "other";

// Client details
export interface ClientDetails {
  fullName: string;
  dateOfBirth: string;
  phone?: string;
  email?: string;
  address?: string;
  postcode?: string;
  preferredContact: PreferredContact;
  communicationNeeds: string[];
  gpPractice?: string;
  nhsNumber?: string;
}

// Referral details
export interface ReferralDetails {
  source: ReferralSource;
  referrerName?: string;
  referrerOrganisation?: string;
  referrerContact?: string;
  dateReceived: string;
  reasons: string[];
  supportRequested: string;
}

// Risk assessment
export interface RiskAssessment {
  riskToSelf: RiskLevel;
  riskToOthers: RiskLevel;
  riskFromOthers: RiskLevel;
  childrenInHousehold: boolean;
  numberOfChildren?: number;
  safeguardingConcerns: boolean;
  safeguardingDetails?: string;
  urgency: UrgencyLevel;
}

// Consent
export interface ConsentDetails {
  shareInformation: boolean;
  contactClient: boolean;
  preferredTimes: string[];
  barriersToEngagement?: string;
}

// Case note
export interface Note {
  id: string;
  content: string;
  createdAt: string;
  createdBy?: string;
}

// Case outcome
export interface CaseOutcome {
  type: OutcomeType;
  details?: string;
  closedDate: string;
}

// Main case interface
export interface Case {
  id: string;
  status: CaseStatus;
  priority: Priority;
  triageScore: number;
  flags: string[];
  client: ClientDetails;
  referral: ReferralDetails;
  risk: RiskAssessment;
  consent: ConsentDetails;
  assignedTo?: string;
  notes: Note[];
  outcome?: CaseOutcome;
  createdAt: string;
  updatedAt: string;
}

// Form configuration types
export interface FormFieldOption {
  value: string;
  label: string;
}

export interface FormField {
  id: string;
  section: string;
  label: string;
  description?: string;
  type:
    | "text"
    | "email"
    | "tel"
    | "date"
    | "number"
    | "select"
    | "radio"
    | "checkbox"
    | "textarea"
    | "multiselect";
  required: boolean | ((answers: Record<string, unknown>) => boolean);
  options?: FormFieldOption[];
  validation?: {
    pattern?: RegExp;
    patternMessage?: string;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
  };
  visibleWhen?: (answers: Record<string, unknown>) => boolean;
}

export interface FormSection {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
}

// Context action types
export type CaseAction =
  | { type: "ADD_CASE"; payload: Case }
  | { type: "UPDATE_CASE"; payload: { id: string; updates: Partial<Case> } }
  | { type: "DELETE_CASE"; payload: string }
  | { type: "ADD_NOTE"; payload: { caseId: string; note: Note } }
  | { type: "LOAD_CASES"; payload: Case[] }
  | { type: "CLEAR_ALL" };

// Accessibility settings
export interface AccessibilitySettings {
  textScale: number;
  highContrast: boolean;
  reducedMotion: boolean;
}
