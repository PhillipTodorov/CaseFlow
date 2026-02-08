import type { Case } from "../types";

const STORAGE_KEYS = {
  cases: "caseflow_cases",
  settings: "caseflow_settings",
  draft: "caseflow_draft",
  currentUser: "caseflow_current_user",
} as const;

// Core CRUD
export function loadCases(): Case[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.cases);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveCases(cases: Case[]): void {
  localStorage.setItem(STORAGE_KEYS.cases, JSON.stringify(cases));
}

export function saveDraft(draft: Record<string, unknown>): void {
  localStorage.setItem(STORAGE_KEYS.draft, JSON.stringify(draft));
}

export function loadDraft(): Record<string, unknown> | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.draft);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  localStorage.removeItem(STORAGE_KEYS.draft);
}

export function getCurrentUser(): string {
  return localStorage.getItem(STORAGE_KEYS.currentUser) || "";
}

export function setCurrentUser(name: string): void {
  localStorage.setItem(STORAGE_KEYS.currentUser, name);
}

export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}

// Export functions
export function exportToJSON(cases: Case[]): void {
  const blob = new Blob([JSON.stringify(cases, null, 2)], {
    type: "application/json",
  });
  downloadBlob(
    blob,
    `caseflow-export-${new Date().toISOString().split("T")[0]}.json`
  );
}

export function exportToCSV(cases: Case[]): void {
  const headers = [
    "ID",
    "Status",
    "Priority",
    "Triage Score",
    "Flags",
    "Client Name",
    "Date of Birth",
    "Phone",
    "Email",
    "Postcode",
    "Referral Source",
    "Date Received",
    "Reasons",
    "Support Requested",
    "Risk to Self",
    "Risk to Others",
    "Risk from Others",
    "Children in Household",
    "Safeguarding Concerns",
    "Urgency",
    "Assigned To",
    "Created At",
    "Updated At",
  ];

  const rows = cases.map((c) => [
    c.id,
    c.status,
    c.priority,
    c.triageScore,
    c.flags.join("; "),
    c.client.fullName,
    c.client.dateOfBirth,
    c.client.phone || "",
    c.client.email || "",
    c.client.postcode || "",
    c.referral.source,
    c.referral.dateReceived,
    c.referral.reasons.join("; "),
    c.referral.supportRequested,
    c.risk.riskToSelf,
    c.risk.riskToOthers,
    c.risk.riskFromOthers,
    c.risk.childrenInHousehold ? "Yes" : "No",
    c.risk.safeguardingConcerns ? "Yes" : "No",
    c.risk.urgency,
    c.assignedTo || "",
    c.createdAt,
    c.updatedAt,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  downloadBlob(
    blob,
    `caseflow-export-${new Date().toISOString().split("T")[0]}.csv`
  );
}

export function importFromJSON(file: File): Promise<Case[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (!Array.isArray(data)) throw new Error("Invalid format");
        resolve(data as Case[]);
      } catch {
        reject(new Error("Invalid JSON file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function getStorageUsage(): {
  used: number;
  limit: number;
  percentage: number;
} {
  let used = 0;
  for (const key of Object.values(STORAGE_KEYS)) {
    const item = localStorage.getItem(key);
    if (item) used += item.length * 2;
  }
  const limit = 5 * 1024 * 1024;
  return { used, limit, percentage: Math.round((used / limit) * 100) };
}
