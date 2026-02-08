import type { Case, Priority, RiskAssessment } from "../types";
import {
  triageWeights,
  priorityThresholds,
  autoFlags,
} from "../data/triageRules";

export function calculateTriageScore(risk: RiskAssessment): number {
  let score = 0;
  score += triageWeights.riskToSelf[risk.riskToSelf];
  score += triageWeights.riskToOthers[risk.riskToOthers];
  score += triageWeights.riskFromOthers[risk.riskFromOthers];
  score +=
    triageWeights.safeguardingConcerns[
      String(risk.safeguardingConcerns) as "true" | "false"
    ];
  score += triageWeights.urgency[risk.urgency];
  score +=
    triageWeights.childrenInHousehold[
      String(risk.childrenInHousehold) as "true" | "false"
    ];
  return Math.min(score, 100);
}

export function getPriorityFromScore(score: number): Priority {
  if (score >= priorityThresholds.urgent.min) return "urgent";
  if (score >= priorityThresholds.high.min) return "high";
  if (score >= priorityThresholds.medium.min) return "medium";
  return "low";
}

export function getResponseTimeframe(priority: Priority): string {
  return priorityThresholds[priority].response;
}

export function generateFlags(caseData: Case): string[] {
  return autoFlags
    .filter(({ condition }) => condition(caseData))
    .map(({ flag }) => flag);
}

export function triageCase(caseData: Case): {
  score: number;
  priority: Priority;
  flags: string[];
} {
  const score = calculateTriageScore(caseData.risk);
  const priority = getPriorityFromScore(score);
  const flags = generateFlags(caseData);
  return { score, priority, flags };
}
