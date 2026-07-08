#!/usr/bin/env node
import { Command } from 'commander';
import { parseCommand } from '@inode/parser';
import { collectRepoContext } from '@inode/context';
import { analyzeCommand } from '@inode/predictor';
import { renderAssessment } from '@inode/output';
import { getRuleById, describeRule } from '@inode/rules';
import chalk from 'chalk';

const program = new Command();

program
  .name('inode')
  .description('inode-cli — see what a command will actually do before you run it.')
  .version('0.1.0');

program
  .command('parse <command...>')
  .description('Parse a raw command into its structured form (debug utility for Sprint 1)')
  .allowUnknownOption()
  .action((commandParts: string[]) => {
    const raw = commandParts.join(' ');
    const parsed = parseCommand(raw);
    console.log(JSON.stringify(parsed, null, 2));
  });

program
  .command('check <command...>')
  .description('Assess the risk of a command before you run it')
  .option('--explain', 'Show which rule matched and exactly why')
  .allowUnknownOption()
  .action((commandParts: string[], options: { explain?: boolean }) => {
    const raw = commandParts.join(' ');
    const assessment = analyzeCommand(raw, process.cwd());
    console.log(renderAssessment(raw, assessment));

    if (!options.explain) return;

    if (!assessment.matchedRule) {
      console.log(chalk.dim('\nNo rule matched — nothing to explain.'));
      return;
    }

    const rule = getRuleById(assessment.matchedRule);
    if (!rule) {
      console.log(
        chalk.dim(
          `\nRule "${assessment.matchedRule}" matched, but its definition could not be found.`,
        ),
      );
      return;
    }

    console.log('');
    for (const line of describeRule(rule)) {
      console.log(chalk.dim(line));
    }
  });

program
  .command('context')
  .description('Show what we can detect about the current repo (debug utility for Sprint 3)')
  .action(() => {
    const context = collectRepoContext(process.cwd());
    console.log(JSON.stringify(context, null, 2));
  });

program.parse(process.argv);
