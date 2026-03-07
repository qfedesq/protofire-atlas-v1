import { createHash, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

const adminCookieName = "atlas_admin_session";
const localDevelopmentPassword = "atlas-admin";

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
    enabled: password.length > 0,
    defaultPassword:
      process.env.NODE_ENV !== "production" &&
      password === localDevelopmentPassword
        ? localDevelopmentPassword
        : null,
  };
}

export async function isAdminAuthenticated() {
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
