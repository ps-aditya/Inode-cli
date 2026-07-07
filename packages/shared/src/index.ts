/**
 * Shared types used across every package in the monorepo.
 * Keeping these in one place is what lets parser/rules/predictor/output
 * evolve independently without drifting out of sync.
 */

export interface ParsedCommand {
  raw: string;
  command: string;
  subcommand: string | null;
  flags: string[];
  args: string[];
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RiskEffect {
  /** Short, user-facing description of one concrete effect of running the command. */
  description: string;
}

export interface RiskAssessment {
  level: RiskLevel;
  /** 0-100. How confident we are in this assessment. */
  confidence: number;
  effects: RiskEffect[];
  /** Whether the action can plausibly be undone. */
  undoable: boolean;
  /** How to undo it, if undoable. */
  undoHint?: string;
  /** Which rule id triggered this assessment, for debugging / --explain. */
  matchedRule?: string;
}

export interface RepoContext {
  isGitRepo: boolean;
  currentBranch?: string;
  isProtectedBranch?: boolean;
  hasUncommittedChanges?: boolean;
  hasRemote?: boolean;
  ahead?: number;
  behind?: number;
}
