// src/lib/db/index.ts
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';
import path from 'path';

const getDbUrl = () => {
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && !envUrl.startsWith('file:.')) {
    return envUrl;
  }
  // Standard resolved absolute path to local data/vdr.db
  const localDb = path.join(process.cwd(), 'data', 'vdr.db');
  return `file:${localDb}`;
};

export const client = createClient({
  url: getDbUrl(),
});

export const db = drizzle(client, { schema });
export * from './schema';
