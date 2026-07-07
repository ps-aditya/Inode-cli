import { describe, expect, it } from 'vitest';
import { parseCommand } from './index';

describe('parseCommand', () => {
  it('parses a basic git push --force command', () => {
    expect(parseCommand('git push --force')).toEqual({
      raw: 'git push --force',
      command: 'git',
      subcommand: 'push',
      flags: ['--force'],
      args: [],
    });
  });

  it('treats the first non-flag token as the subcommand, even before later flags', () => {
    // By design, "subcommand" just means "first non-flag token after the
    // command" — the parser has no semantic knowledge of any specific CLI,
    // so it does not know "/repo" isn't a real subcommand. Rule engines that
    // consume this output are responsible for command-specific meaning.
    expect(parseCommand('git -C /repo push')).toEqual({
      raw: 'git -C /repo push',
      command: 'git',
      subcommand: '/repo',
      flags: ['-C'],
      args: ['push'],
    });
  });

  it('parses rm -rf / (first non-flag token becomes the subcommand slot)', () => {
    expect(parseCommand('rm -rf /')).toEqual({
      raw: 'rm -rf /',
      command: 'rm',
      subcommand: '/',
      flags: ['-rf'],
      args: [],
    });
  });

  it('handles quoted arguments as a single token', () => {
    expect(parseCommand('git commit -m "fix: thing"')).toEqual({
      raw: 'git commit -m "fix: thing"',
      command: 'git',
      subcommand: 'commit',
      flags: ['-m'],
      args: ['fix: thing'],
    });
  });

  it('trims surrounding whitespace', () => {
    expect(parseCommand('  git status  ').command).toBe('git');
  });

  it('handles a command with no flags or args', () => {
    expect(parseCommand('git status')).toEqual({
      raw: 'git status',
      command: 'git',
      subcommand: 'status',
      flags: [],
      args: [],
    });
  });
});
