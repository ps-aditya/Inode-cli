#!/usr/bin/env node
import { Command } from 'commander';
import { parseCommand } from '@tra/parser';

const program = new Command();

program
  .name('tra')
  .description(
    'Terminal Risk Analyzer — see what a command will actually do before you run it.',
  )
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

program.parse(process.argv);
