import type { ParsedCommand } from '@inode/shared';
import { tokenize } from './tokenize';

/**
 * Parses a raw terminal command string into a structured ParsedCommand.
 *
 * Rules (deliberately simple, no AI):
 * - token[0]            -> command
 * - first non-flag token after the command -> subcommand
 * - any token starting with "-" or "--"     -> flags
 * - everything else                         -> args
 *
 * Examples:
 *   "git push --force"
 *     -> { command: "git", subcommand: "push", flags: ["--force"], args: [] }
 *
 *   "rm -rf /"
 *     -> { command: "rm", subcommand: "/", flags: ["-rf"], args: [] }
 *
 * Note: "subcommand" here is purely positional (first non-flag token), not
 * semantic. The parser doesn't know that "/" isn't a real subcommand for
 * `rm` — command-specific meaning belongs to the rule engine, not here.
 */
export function parseCommand(raw: string): ParsedCommand {
  const trimmed = raw.trim();
  const tokens = tokenize(trimmed);

  const flags: string[] = [];
  const args: string[] = [];
  let command = '';
  let subcommand: string | null = null;

  tokens.forEach((token, index) => {
    if (index === 0) {
      command = token;
      return;
    }

    const isFlag = token.startsWith('-');

    if (isFlag) {
      flags.push(token);
      return;
    }

    if (subcommand === null) {
      subcommand = token;
      return;
    }

    args.push(token);
  });

  return {
    raw: trimmed,
    command,
    subcommand,
    flags,
    args,
  };
}

export { tokenize } from './tokenize';
export type { ParsedCommand } from '@inode/shared';
