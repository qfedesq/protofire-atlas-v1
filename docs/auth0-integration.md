# Auth0 Integration

Atlas uses Auth0 only for internal access control.

It is not a public-user auth system.

## What Auth0 protects

When Auth0 is configured, Atlas uses it for:

- internal analysis routes
- internal analysis trigger actions
- internal applicability review page
- internal target/account pages
- internal admin routes when accessed through Auth0 login

Public Atlas pages and APIs remain public.

## Core files

Client:

- [`lib/auth0.ts`](/Users/qfedesq/Desktop/Atlas/lib/auth0.ts)

Network boundary:

- [`proxy.ts`](/Users/qfedesq/Desktop/Atlas/proxy.ts)

Internal auth helper:

- [`lib/admin/auth.ts`](/Users/qfedesq/Desktop/Atlas/lib/admin/auth.ts)

## Required environment variables

- `AUTH0_DOMAIN`
- `AUTH0_CLIENT_ID`
- `AUTH0_CLIENT_SECRET`
- `AUTH0_SECRET`

Recommended:

- `APP_BASE_URL`

## Route behavior

Auth0 middleware is mounted through `proxy.ts`, which enables the SDK auth routes such as:

- `/auth/login`
- `/auth/callback`
- `/auth/logout`

Atlas internal helpers then read the Auth0 session server-side.

## Internal access model

Atlas currently supports two internal access modes:

1. Auth0 session
2. legacy password fallback

Legacy fallback still exists so Atlas can operate in environments where Auth0 is not configured yet. Auth0 does not remove that fallback automatically.

## Internal helpers

Use:

- `getAuthenticatedInternalUser()`
- `requireAuthenticatedInternalUser(returnTo)`

Do not reimplement route protection ad hoc in internal pages.

## Analysis workflow dependency

The GPT-assisted chain analysis workflow must only be triggerable by authenticated internal users. That protection is enforced before the analysis action runs.

## Auth0 setup notes

The Auth0 application should be a regular web application.

You must register the correct callback and logout URLs for the environment, including the production Vercel domain and any local development URL you actively use.

## What Auth0 does not cover

Atlas does not use Auth0 for:

- public rankings
- public data APIs
- embeds
- badges
- public chain pages

This keeps public Atlas data accessible while protecting internal GTM and AI-assisted workflows.
