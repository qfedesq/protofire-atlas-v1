import { Auth0Client } from "@auth0/nextjs-auth0/server";

const requiredAuth0EnvKeys = [
  "AUTH0_DOMAIN",
  "AUTH0_CLIENT_ID",
  "AUTH0_CLIENT_SECRET",
  "AUTH0_SECRET",
] as const;

let auth0Client: Auth0Client | null | undefined;

export function isAuth0Configured() {
  return requiredAuth0EnvKeys.every((key) => process.env[key]?.trim());
}

function resolveAppBaseUrl() {
  return (
    process.env.APP_BASE_URL?.trim() ||
    process.env.AUTH0_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    "http://localhost:3000"
  );
}

export function getAuth0Client() {
  if (!isAuth0Configured()) {
    return null;
  }

  if (auth0Client === undefined) {
    auth0Client = new Auth0Client({
      appBaseUrl: resolveAppBaseUrl(),
      authorizationParameters: {
        scope: "openid profile email",
      },
    });
  }

  return auth0Client;
}
