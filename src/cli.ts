#!/usr/bin/env node
import inquirer from 'inquirer';
import { readLogGroups } from './config';
import { dateRange } from './utils/date';
import { Effect, pipe } from 'effect';
import { SingleBar, Presets } from 'cli-progress';
import * as fs from 'fs/promises';
import * as path from 'path';

type BarMap = Record<string, SingleBar>;

const program = pipe(
  readLogGroups,
  Effect.flatMap((groups) =>
    Effect.tryPromise({
      try: async () => {
        const { selected } = await inquirer.prompt([
          {
            type: 'checkbox',
            name: 'selected',
            message: 'Select log groups',
            choices: groups,
          },
        ]);
        if (selected.length === 0) throw new Error('No log group selected');

        const { begin } = await inquirer.prompt([
          { type: 'input', name: 'begin', message: 'Begin Date (YYYYMMDD)' },
        ]);
        const { end } = await inquirer.prompt([
          { type: 'input', name: 'end', message: 'End Date (YYYYMMDD)' },
        ]);
        const dates = dateRange(begin, end);
        const files = selected.flatMap((g: string) =>
          dates.map((d) => `${g.split('/').pop()}-${d}.log`)
        );
        console.log(files.map((f) => `- ${f}`).join('\n'));

        const { ok } = await inquirer.prompt([
          { type: 'confirm', name: 'ok', message: 'ok?', default: true },
        ]);
        if (!ok) return;

        const bars: BarMap = {};
        for (const file of files) {
          bars[file] = new SingleBar(
            { format: `${file} [{bar}] {percentage}%` },
            Presets.shades_classic
          );
          bars[file].start(100, 0);
        }

        for (const file of files) {
          for (let i = 0; i <= 100; i += 10) {
            await new Promise((res) => setTimeout(res, 100));
            bars[file].update(i);
          }
          await fs.writeFile(
            path.resolve(process.cwd(), file),
            `Simulated log for ${file}\n`
          );
          bars[file].stop();
        }
      },
      catch: (reason) => new Error(String(reason))
    })
  )
);

Effect.runPromise(program).then(
  () => {
    console.log('done');
  },
  (err) => {
    console.error(err.message);
    process.exit(1);
  }
);
