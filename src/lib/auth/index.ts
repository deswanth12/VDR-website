// src/lib/auth/index.ts
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { admins, sessions, Admin } from '@/lib/db/schema';
import { eq, and, gt } from 'drizzle-orm';

export const SESSION_COOKIE_NAME = 'vdr_admin_session';
const SESSION_MAX_AGE_DAYS = 7;
const SESSION_MAX_AGE_MS = SESSION_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

export async function validateAdminCredentials(
  email: string,
  passwordPlain: string
): Promise<Admin | null> {
  try {
    const admin = await db.select().from(admins).where(eq(admins.email, email.trim())).get();
    if (!admin) return null;

    const matches = await bcrypt.compare(passwordPlain, admin.passwordHash);
    if (!matches) return null;

    return admin;
  } catch (err) {
    console.error('Error validating admin credentials:', err);
    return null;
  }
}

export async function createAdminSession(adminId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  const now = new Date().toISOString();
  const expiresAt = Date.now() + SESSION_MAX_AGE_MS;
  const id = `sess_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;

  await db.insert(sessions).values({
    id,
    token,
    adminId,
    expiresAt,
    createdAt: now,
  });

  return token;
}

export async function verifyAdminSessionToken(token: string): Promise<Admin | null> {
  if (!token) return null;

  try {
    const session = await db
      .select({
        session: sessions,
        admin: admins,
      })
      .from(sessions)
      .innerJoin(admins, eq(sessions.adminId, admins.id))
      .where(and(eq(sessions.token, token), gt(sessions.expiresAt, Date.now())))
      .get();

    if (!session) return null;
    return session.admin;
  } catch (err) {
    console.error('Error verifying admin session token:', err);
    return null;
  }
}

export async function getCurrentAdmin(): Promise<Admin | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminSessionToken(token);
}

export async function destroyAdminSession(token: string): Promise<void> {
  if (!token) return;
  try {
    await db.delete(sessions).where(eq(sessions.token, token)).run();
  } catch (err) {
    console.error('Error destroying admin session:', err);
  }
}

export async function setAdminSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_DAYS * 24 * 60 * 60,
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function revokeAdminSessions(adminId: string): Promise<void> {
  try {
    await db.delete(sessions).where(eq(sessions.adminId, adminId)).run();
  } catch (err) {
    console.error('Error revoking admin sessions:', err);
  }
}
