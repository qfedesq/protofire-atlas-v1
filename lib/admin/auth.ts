import { createHash, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getAuth0Client, isAuth0Configured } from "@/lib/auth0";

const adminCookieName = "atlas_admin_session";
const localDevelopmentPassword = "atlas-admin";

export type AuthenticatedInternalUser = {
  provider: "auth0" | "legacy-admin";
  subject: string;
  email?: string;
  displayName: string;
};

function getConfiguredAdminPassword() {
  if (process.env.ATLAS_ADMIN_PASSWORD?.trim()) {
    return process.env.ATLAS_ADMIN_PASSWORD.trim();
  }

  if (process.env.NODE_ENV !== "production") {
    return localDevelopmentPassword;
  }

  return "";
}

function hashValue(input: string) {
  return createHash("sha256").update(input).digest("hex");
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function getAdminAccessState() {
  const password = getConfiguredAdminPassword();

  return {
    enabled: password.length > 0 || isAuth0Configured(),
    auth0Enabled: isAuth0Configured(),
    defaultPassword:
      process.env.NODE_ENV !== "production" &&
      password === localDevelopmentPassword
        ? localDevelopmentPassword
        : null,
  };
}

export async function isAdminAuthenticated() {
  const auth0 = getAuth0Client();

  if (auth0) {
    const session = await auth0.getSession();

    if (session?.user) {
      return true;
    }
  }

  const password = getConfiguredAdminPassword();

  if (!password) {
    return false;
  }

  const cookieStore = await cookies();
  const currentSession = cookieStore.get(adminCookieName)?.value;

  if (!currentSession) {
    return false;
  }

  return safeCompare(currentSession, hashValue(password));
}

export async function createAdminSession(password: string) {
  const configuredPassword = getConfiguredAdminPassword();

  if (!configuredPassword || !safeCompare(password, configuredPassword)) {
    return false;
  }

  const cookieStore = await cookies();

  cookieStore.set(adminCookieName, hashValue(configuredPassword), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return true;
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(adminCookieName);
}

export async function getAuthenticatedInternalUser(): Promise<AuthenticatedInternalUser | null> {
  const auth0 = getAuth0Client();

  if (auth0) {
    const session = await auth0.getSession();
    const user = session?.user;

    if (user) {
      return {
        provider: "auth0",
        subject: user.sub,
        email: user.email,
        displayName: user.name ?? user.email ?? user.sub,
      };
    }
  }

  if (await isAdminAuthenticated()) {
    return {
      provider: "legacy-admin",
      subject: "legacy-admin",
      displayName: "Legacy admin session",
    };
  }

  return null;
}

export function buildInternalLoginHref(returnTo = "/internal/admin") {
  if (isAuth0Configured()) {
    return `/auth/login?returnTo=${encodeURIComponent(returnTo)}`;
  }

  return "/internal/admin";
}

export async function requireAuthenticatedInternalUser(returnTo: string) {
  const user = await getAuthenticatedInternalUser();

  if (user) {
    return user;
  }

  redirect(buildInternalLoginHref(returnTo));
}
