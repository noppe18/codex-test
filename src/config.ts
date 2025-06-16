import { promises as fs } from 'fs';
import * as path from 'path';

const configPath = path.resolve(__dirname, '../config/logGroups.json');

export const readLogGroups = async (): Promise<string[]> => {
  const data = await fs.readFile(configPath, 'utf8');
  const json = JSON.parse(data) as { logGroups: string[] };
  return json.logGroups;
};
