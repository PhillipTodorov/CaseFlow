import type { Case, Priority } from "../types";

export const triageWeights = {
  riskToSelf: { none: 0, low: 10, medium: 30, high: 50 },
  riskToOthers: { none: 0, low: 10, medium: 25, high: 45 },
  riskFromOthers: { none: 0, low: 10, medium: 25, high: 45 },
  safeguardingConcerns: { false: 0, true: 40 },
  urgency: { routine: 0, soon: 15, urgent: 35, crisis: 50 },
  childrenInHousehold: { false: 0, true: 10 },
} as const;

export const priorityThresholds: Record<
  Priority,
  { min: number; max: number; response: string }
> = {
  low: { min: 0, max: 20, response: "10 working days" },
  medium: { min: 21, max: 40, response: "5 working days" },
  high: { min: 41, max: 60, response: "48 hours" },
  urgent: { min: 61, max: 100, response: "Same day" },
};

export interface AutoFlag {
  condition: (c: Case) => boolean;
  flag: string;
}

export const autoFlags: AutoFlag[] = [
  {
    condition: (c) => c.risk.riskToSelf === "high",
    flag: "Crisis assessment required",
  },
  {
    condition: (c) => c.risk.safeguardingConcerns,
    flag: "Safeguarding referral required",
  },
  {
    condition: (c) =>
      c.risk.childrenInHousehold && c.risk.riskFromOthers !== "none",
    flag: "Children's services notification",
  },
  {
    condition: (c) => c.risk.urgency === "crisis",
    flag: "Immediate response required",
  },
];
