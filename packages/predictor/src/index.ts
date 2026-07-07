import type { ParsedCommand, RepoContext, RiskAssessment } from '@tra/shared';

/**
 * Sprint 4 (later): combines rule-engine output with RepoContext
 * (Sprint 3) to produce concrete, specific predictions — e.g. "this will
 * affect 2 collaborators" instead of "force push is dangerous".
 *
 * Deliberately unimplemented today.
 */
export function predict(
  _command: ParsedCommand,
  _context: RepoContext,
  _baseAssessment: RiskAssessment,
): RiskAssessment {
  throw new Error('Not implemented yet — this is Sprint 4 (Prediction Engine).');
}
