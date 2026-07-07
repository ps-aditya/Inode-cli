import type { ParsedCommand, RiskAssessment } from '@tra/shared';

/**
 * Sprint 2 (next): a JSON-driven rule engine that maps a ParsedCommand
 * to a RiskAssessment. No AI, no ML — a deterministic lookup table so
 * results are instant and 100% explainable.
 *
 * Deliberately unimplemented today. Today is Sprint 1 (the parser) only.
 */
export function assessRisk(_command: ParsedCommand): RiskAssessment {
  throw new Error('Not implemented yet — this is Sprint 2 (Risk Engine).');
}
