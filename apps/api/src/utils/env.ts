import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

export function setupEnv() {
  const rootEnvPath = path.resolve(process.cwd(), '../../.env');
  
  if (fs.existsSync(rootEnvPath)) {
    dotenv.config({ path: rootEnvPath });
    return true;
  }
  
  dotenv.config();
  return process.env.DATABASE_URL !== undefined;
}