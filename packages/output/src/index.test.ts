import { describe, expect, it } from 'vitest';
import type { RiskAssessment } from '@inode/shared';
import { renderAssessment } from './index';

describe('renderAssessment', () => {
  it('renders a quiet single line for LOW risk with no effects', () => {
    const assessment: RiskAssessment = {
      level: 'LOW',
      confidence: 100,
      effects: [],
      undoable: true,
    };
    const output = renderAssessment('git status', assessment);
    expect(output).toContain('git status');
    expect(output).toContain('looks safe');
    expect(output.split('\n').length).toBe(1);
  });

  it('renders the explanatory effect for a LOW assessment that still has one', () => {
    const assessment: RiskAssessment = {
      level: 'LOW',
      confidence: 95,
      effects: [
        {
          description: 'No remote is configured — this command would fail before changing anything',
        },
      ],
      undoable: true,
    };
    const output = renderAssessment('git push --force', assessment);
    expect(output).toContain('No remote is configured');
    expect(output.split('\n').length).toBe(1);
  });

  it('renders a single line for HIGH risk with effects, undo, and confidence', () => {
    const assessment: RiskAssessment = {
      level: 'HIGH',
      confidence: 90,
      effects: [
        { description: 'Rewrites remote history' },
        { description: 'Affects 1 collaborator' },
      ],
      undoable: true,
      undoHint: 'git reflog',
      matchedRule: 'git-force-push',
    };
    const output = renderAssessment('git push --force', assessment);
    expect(output.split('\n').length).toBe(1); // advisory, single line — not a panel
    expect(output).toContain('HIGH');
    expect(output).toContain('git push --force');
    expect(output).toContain('rewrites remote history');
    expect(output).toContain('affects 1 collaborator');
    expect(output).toContain('git reflog');
    expect(output).toContain('90%');
    // matchedRule is intentionally NOT shown by default — that's what
    // --explain is for, to keep this line uncluttered.
    expect(output).not.toContain('git-force-push');
  });

  it('renders "not possible" for undo when undoable is false', () => {
    const assessment: RiskAssessment = {
      level: 'CRITICAL',
      confidence: 95,
      effects: [{ description: 'Permanently deletes the target' }],
      undoable: false,
    };
    const output = renderAssessment('rm -rf /tmp/foo', assessment);
    expect(output).toContain('not possible');
    expect(output).toContain('CRITICAL');
    expect(output.split('\n').length).toBe(1);
  });

  it('stays a single line even with a long effect description (no box, nothing to collapse)', () => {
    const assessment: RiskAssessment = {
      level: 'CRITICAL',
      confidence: 95,
      effects: [
        { description: 'Permanently deletes the target and everything inside it' },
        {
          description: "No trash/recycle bin — deletion bypasses the filesystem's undo entirely",
        },
      ],
      undoable: false,
      matchedRule: 'fs-rm-recursive-force',
    };
    const output = renderAssessment('rm -rf /tmp/foo', assessment);
    expect(output.split('\n').length).toBe(1);
    expect(output).toContain('deletion bypasses');
    expect(output).toContain('entirely');
  });

  it('truncates an extremely long raw command instead of printing it in full', () => {
    const longRaw = `git push --force ${'x'.repeat(150)}`;
    const assessment: RiskAssessment = {
      level: 'HIGH',
      confidence: 90,
      effects: [{ description: 'Rewrites remote history' }],
      undoable: true,
      undoHint: 'git reflog',
      matchedRule: 'git-force-push',
    };
    const output = renderAssessment(longRaw, assessment);
    expect(output.split('\n').length).toBe(1);
    expect(output).toContain('…');
    expect(output).not.toContain('x'.repeat(150));
  });

  it('handles a long undo hint on a single line without issue', () => {
    const assessment: RiskAssessment = {
      level: 'HIGH',
      confidence: 90,
      effects: [{ description: 'Discards uncommitted changes in tracked files' }],
      undoable: true,
      undoHint: 'git reflog, but uncommitted working-tree changes are gone for good',
      matchedRule: 'git-hard-reset',
    };
    const output = renderAssessment('git reset --hard HEAD', assessment);
    expect(output.split('\n').length).toBe(1);
    expect(output).toContain('gone for good');
  });
});
