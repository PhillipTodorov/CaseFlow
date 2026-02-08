import type { FormSection, FormField } from "../types";

export const SECTIONS: FormSection[] = [
  {
    id: "clientDetails",
    title: "Client Details",
    shortTitle: "Client",
    description: "Basic information about the client being referred.",
  },
  {
    id: "referralInfo",
    title: "Referral Information",
    shortTitle: "Referral",
    description: "Details about how and why the referral was made.",
  },
  {
    id: "riskAssessment",
    title: "Risk Assessment",
    shortTitle: "Risk",
    description: "Assessment of risks to help determine priority.",
  },
  {
    id: "consent",
    title: "Consent",
    shortTitle: "Consent",
    description: "Client consent for information sharing and contact.",
  },
];

export const FIELDS: FormField[] = [
  // === Section 1: Client Details ===
  {
    id: "client.fullName",
    section: "clientDetails",
    label: "Full name",
    type: "text",
    required: true,
    validation: { minLength: 2 },
  },
  {
    id: "client.dateOfBirth",
    section: "clientDetails",
    label: "Date of birth",
    type: "date",
    required: true,
  },
  {
    id: "client.phone",
    section: "clientDetails",
    label: "Phone number",
    type: "tel",
    required: false,
    validation: {
      pattern: /^(\+44|0)\d{9,10}$/,
      patternMessage: "Enter a valid UK phone number",
    },
  },
  {
    id: "client.email",
    section: "clientDetails",
    label: "Email address",
    type: "email",
    required: false,
    validation: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      patternMessage: "Enter a valid email address",
    },
  },
  {
    id: "client.address",
    section: "clientDetails",
    label: "Address",
    type: "textarea",
    required: false,
  },
  {
    id: "client.postcode",
    section: "clientDetails",
    label: "Postcode",
    type: "text",
    required: false,
    validation: {
      pattern: /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i,
      patternMessage: "Enter a valid UK postcode",
    },
  },
  {
    id: "client.preferredContact",
    section: "clientDetails",
    label: "Preferred contact method",
    type: "select",
    required: false,
    options: [
      { value: "phone", label: "Phone" },
      { value: "email", label: "Email" },
      { value: "text", label: "Text message" },
      { value: "letter", label: "Letter" },
    ],
  },
  {
    id: "client.communicationNeeds",
    section: "clientDetails",
    label: "Communication needs",
    description: "Select any that apply",
    type: "multiselect",
    required: false,
    options: [
      { value: "interpreter_required", label: "Interpreter required" },
      { value: "easy_read", label: "Easy read format" },
      { value: "large_print", label: "Large print" },
      { value: "bsl", label: "British Sign Language" },
      { value: "hearing_loop", label: "Hearing loop" },
      { value: "none", label: "None" },
    ],
  },
  {
    id: "client.gpPractice",
    section: "clientDetails",
    label: "GP practice",
    type: "text",
    required: false,
  },
  {
    id: "client.nhsNumber",
    section: "clientDetails",
    label: "NHS number",
    type: "text",
    required: false,
    validation: {
      pattern: /^\d{10}$/,
      patternMessage: "Enter a 10-digit NHS number",
    },
  },

  // === Section 2: Referral Information ===
  {
    id: "referral.source",
    section: "referralInfo",
    label: "Referral source",
    type: "select",
    required: true,
    options: [
      { value: "self", label: "Self-referral" },
      { value: "gp", label: "GP" },
      { value: "hospital", label: "Hospital" },
      { value: "social_services", label: "Social services" },
      { value: "police", label: "Police" },
      { value: "charity", label: "Charity / voluntary organisation" },
      { value: "family", label: "Family member" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "referral.referrerName",
    section: "referralInfo",
    label: "Referrer name",
    type: "text",
    required: (answers) => {
      const source = answers["referral.source"];
      return source !== undefined && source !== "self";
    },
    visibleWhen: (answers) => {
      const source = answers["referral.source"];
      return source !== undefined && source !== "" && source !== "self";
    },
  },
  {
    id: "referral.referrerOrganisation",
    section: "referralInfo",
    label: "Referrer organisation",
    type: "text",
    required: (answers) => {
      const source = answers["referral.source"];
      return source !== undefined && source !== "self";
    },
    visibleWhen: (answers) => {
      const source = answers["referral.source"];
      return source !== undefined && source !== "" && source !== "self";
    },
  },
  {
    id: "referral.referrerContact",
    section: "referralInfo",
    label: "Referrer contact details",
    type: "text",
    required: false,
    visibleWhen: (answers) => {
      const source = answers["referral.source"];
      return source !== undefined && source !== "" && source !== "self";
    },
  },
  {
    id: "referral.dateReceived",
    section: "referralInfo",
    label: "Date referral received",
    type: "date",
    required: true,
  },
  {
    id: "referral.reasons",
    section: "referralInfo",
    label: "Reasons for referral",
    description: "Select all that apply",
    type: "multiselect",
    required: true,
    options: [
      { value: "mental_health", label: "Mental health concerns" },
      { value: "substance_misuse", label: "Substance misuse" },
      { value: "domestic_abuse", label: "Domestic abuse" },
      { value: "housing", label: "Housing issues" },
      { value: "financial", label: "Financial difficulties" },
      { value: "family_breakdown", label: "Family breakdown" },
      { value: "isolation", label: "Social isolation" },
      { value: "physical_health", label: "Physical health" },
      { value: "disability", label: "Disability support" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "referral.supportRequested",
    section: "referralInfo",
    label: "Support requested",
    description: "Describe what support is being requested",
    type: "textarea",
    required: true,
    validation: { minLength: 10 },
  },

  // === Section 3: Risk Assessment ===
  {
    id: "risk.riskToSelf",
    section: "riskAssessment",
    label: "Risk to self",
    description: "Including self-harm, suicidal ideation, self-neglect",
    type: "select",
    required: true,
    options: [
      { value: "none", label: "None identified" },
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" },
    ],
  },
  {
    id: "risk.riskToOthers",
    section: "riskAssessment",
    label: "Risk to others",
    description: "Including aggression, violence, exploitation",
    type: "select",
    required: true,
    options: [
      { value: "none", label: "None identified" },
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" },
    ],
  },
  {
    id: "risk.riskFromOthers",
    section: "riskAssessment",
    label: "Risk from others",
    description: "Including abuse, exploitation, neglect",
    type: "select",
    required: true,
    options: [
      { value: "none", label: "None identified" },
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" },
    ],
  },
  {
    id: "risk.childrenInHousehold",
    section: "riskAssessment",
    label: "Are there children in the household?",
    type: "radio",
    required: true,
    options: [
      { value: "true", label: "Yes" },
      { value: "false", label: "No" },
    ],
  },
  {
    id: "risk.numberOfChildren",
    section: "riskAssessment",
    label: "Number of children",
    type: "number",
    required: true,
    validation: { min: 1, max: 20 },
    visibleWhen: (answers) => answers["risk.childrenInHousehold"] === "true",
  },
  {
    id: "risk.safeguardingConcerns",
    section: "riskAssessment",
    label: "Are there safeguarding concerns?",
    type: "radio",
    required: true,
    options: [
      { value: "true", label: "Yes" },
      { value: "false", label: "No" },
    ],
  },
  {
    id: "risk.safeguardingDetails",
    section: "riskAssessment",
    label: "Safeguarding details",
    description: "Describe the safeguarding concerns",
    type: "textarea",
    required: true,
    visibleWhen: (answers) =>
      answers["risk.safeguardingConcerns"] === "true",
  },
  {
    id: "risk.urgency",
    section: "riskAssessment",
    label: "Urgency",
    description: "How quickly does this referral need to be actioned?",
    type: "select",
    required: true,
    options: [
      { value: "routine", label: "Routine" },
      { value: "soon", label: "Soon (within a week)" },
      { value: "urgent", label: "Urgent (within 48 hours)" },
      { value: "crisis", label: "Crisis (immediate)" },
    ],
  },

  // === Section 4: Consent ===
  {
    id: "consent.shareInformation",
    section: "consent",
    label:
      "The client consents to their information being shared with relevant services",
    type: "checkbox",
    required: true,
  },
  {
    id: "consent.contactClient",
    section: "consent",
    label: "The client consents to being contacted by the service",
    type: "checkbox",
    required: true,
  },
  {
    id: "consent.preferredTimes",
    section: "consent",
    label: "Preferred contact times",
    type: "multiselect",
    required: false,
    options: [
      { value: "morning", label: "Morning (9am\u201312pm)" },
      { value: "afternoon", label: "Afternoon (12pm\u20135pm)" },
      { value: "evening", label: "Evening (5pm\u20138pm)" },
      { value: "any", label: "Any time" },
    ],
  },
  {
    id: "consent.barriersToEngagement",
    section: "consent",
    label: "Barriers to engagement",
    description:
      "Any factors that may make it difficult for the client to engage",
    type: "textarea",
    required: false,
  },
];
