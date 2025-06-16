import { promises as fs } from 'fs';
import * as path from 'path';
import { Effect } from 'effect';

const configPath = path.resolve(__dirname, '../config/logGroups.json');

export const readLogGroups: Effect.Effect<never, Error, string[]> = Effect.tryPromise({
  try: async () => {
    const data = await fs.readFile(configPath, 'utf8');
    const json = JSON.parse(data) as { logGroups: string[] };
    return json.logGroups;
  },
  catch: (reason) => new Error(String(reason))
});
