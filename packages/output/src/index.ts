import type { RiskAssessment } from '@tra/shared';

/**
 * Renders a RiskAssessment to the terminal using chalk/boxen/ora.
 * Deliberately unimplemented today — this comes after the rule engine
 * has something real to render.
 */
export function renderAssessment(_assessment: RiskAssessment): string {
  throw new Error('Not implemented yet — this is the Output Formatter.');
}
