import chalk from 'chalk';
import type { RiskAssessment, RiskLevel } from '@inode/shared';

type LevelStyle = {
  icon: string;
  label: (text: string) => string;
};

const LEVEL_STYLE: Record<RiskLevel, LevelStyle> = {
  LOW: { icon: '✓', label: (text) => chalk.green(text) },
  MEDIUM: { icon: '⚠', label: (text) => chalk.yellow.bold(text) },
  HIGH: { icon: '⚠', label: (text) => chalk.red.bold(text) },
  CRITICAL: { icon: '⛔', label: (text) => chalk.magenta.bold(text) },
};

const RAW_COMMAND_MAX_LENGTH = 80;

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}

/** "Rewrites remote history" -> "rewrites remote history", for inline joining. */
function lowercaseFirst(text: string): string {
  if (text.length === 0) return text;
  return text.charAt(0).toLowerCase() + text.slice(1);
}

/**
 * Renders a RiskAssessment as a single line. This is deliberately an
 * advisory side-note, not a gate — `inode check` never blocks real
 * command execution, it's a separate command you run yourself. The
 * output should read that way too: something you glance at and move on
 * from, not a wall you stop at. (An earlier version of this used a
 * multi-line boxen panel; real feedback was that it read as far more
 * disruptive than the tool actually is. This single-line version is the
 * intentional fix for that, not a placeholder for something bigger.)
 */
export function renderAssessment(raw: string, assessment: RiskAssessment): string {
  const style = LEVEL_STYLE[assessment.level];
  const displayRaw = truncate(raw, RAW_COMMAND_MAX_LENGTH);

  if (assessment.level === 'LOW') {
    const [firstEffect] = assessment.effects;
    if (!firstEffect) {
      return chalk.green(`✓ ${displayRaw} — looks safe (no rule matched)`);
    }
    // A LOW assessment can still carry an explanatory effect (e.g. "no
    // remote configured" from the predictor) — show it, just quietly.
    return chalk.green(`✓ ${displayRaw} — ${firstEffect.description}`);
  }

  const effectsText = assessment.effects.map((e) => lowercaseFirst(e.description)).join(', ');
  const undoText = assessment.undoable ? (assessment.undoHint ?? 'possible') : 'not possible';

  const parts = [
    `${style.label(`${style.icon} ${assessment.level}`)}`,
    ` ${displayRaw}`,
    effectsText ? ` — ${effectsText}` : '',
    `. Undo: ${undoText}. (${assessment.confidence}%)`,
  ];

  return parts.join('');
}
