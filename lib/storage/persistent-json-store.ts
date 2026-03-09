import { Pool } from "pg";

import { readJsonFile, writeJsonFile } from "@/lib/storage/json-file";

type PersistentJsonStoreOptions<T> = {
  key: string;
  getFilePath: () => string;
  fallback: T | (() => T);
  validate: (input: unknown) => T;
};

type PersistentJsonStore<T> = {
  initialize: () => Promise<T>;
  getSnapshot: () => T;
  save: (value: T) => Promise<T>;
};

const atlasDocumentsTable = "atlas_documents";

let postgresPool: Pool | null = null;
let postgresTableReady = false;
let postgresTableReadyPromise: Promise<void> | null = null;

function shouldUsePostgresStorage() {
  if (process.env.ATLAS_STORAGE_BACKEND?.trim() === "postgres") {
    return true;
  }

  return process.env.VERCEL === "1" && Boolean(process.env.DATABASE_URL?.trim());
}

function getFallbackValue<T>(fallback: T | (() => T)) {
  return typeof fallback === "function" ? (fallback as () => T)() : fallback;
}

function getPostgresPool() {
  if (!postgresPool) {
    const connectionString = process.env.DATABASE_URL?.trim();

    if (!connectionString) {
      throw new Error("DATABASE_URL is required for Postgres-backed Atlas storage.");
    }

    postgresPool = new Pool({
      connectionString,
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : undefined,
    });
  }

  return postgresPool;
}

async function ensureAtlasDocumentsTable() {
  if (!shouldUsePostgresStorage()) {
    return;
  }

  if (postgresTableReady) {
    return;
  }

  if (!postgresTableReadyPromise) {
    postgresTableReadyPromise = (async () => {
      const pool = getPostgresPool();
      await pool.query(`
        CREATE TABLE IF NOT EXISTS ${atlasDocumentsTable} (
          store_key TEXT PRIMARY KEY,
          payload JSONB NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);
      postgresTableReady = true;
    })().finally(() => {
      postgresTableReadyPromise = null;
    });
  }

  await postgresTableReadyPromise;
}

async function readPersistedValue<T>(
  options: PersistentJsonStoreOptions<T>,
) {
  const filePath = options.getFilePath();
  const fileValue = options.validate(
    readJsonFile(filePath, getFallbackValue(options.fallback)),
  );

  if (!shouldUsePostgresStorage()) {
    return fileValue;
  }

  try {
    await ensureAtlasDocumentsTable();
    const pool = getPostgresPool();
    const result = await pool.query<{ payload: unknown }>(
      `SELECT payload FROM ${atlasDocumentsTable} WHERE store_key = $1 LIMIT 1`,
      [options.key],
    );

    if (result.rows[0]) {
      return options.validate(result.rows[0].payload);
    }

    await pool.query(
      `
        INSERT INTO ${atlasDocumentsTable} (store_key, payload, updated_at)
        VALUES ($1, $2::jsonb, NOW())
        ON CONFLICT (store_key) DO UPDATE
        SET payload = EXCLUDED.payload,
            updated_at = NOW()
      `,
      [options.key, JSON.stringify(fileValue)],
    );

    return fileValue;
  } catch {
    return fileValue;
  }
}

async function persistValue<T>(
  options: PersistentJsonStoreOptions<T>,
  value: T,
) {
  writeJsonFile(options.getFilePath(), value);

  if (!shouldUsePostgresStorage()) {
    return value;
  }

  try {
    await ensureAtlasDocumentsTable();
    const pool = getPostgresPool();
    await pool.query(
      `
        INSERT INTO ${atlasDocumentsTable} (store_key, payload, updated_at)
        VALUES ($1, $2::jsonb, NOW())
        ON CONFLICT (store_key) DO UPDATE
        SET payload = EXCLUDED.payload,
            updated_at = NOW()
      `,
      [options.key, JSON.stringify(value)],
    );
  } catch {
    return value;
  }

  return value;
}

export function createPersistentJsonStore<T>(
  options: PersistentJsonStoreOptions<T>,
): PersistentJsonStore<T> {
  let snapshot: T | undefined;
  let initialized = false;
  let initializationPromise: Promise<T> | null = null;
  let storageSignature = "";

  function getStorageSignature() {
    return shouldUsePostgresStorage()
      ? `postgres:${options.key}`
      : `file:${options.getFilePath()}`;
  }

  async function initialize() {
    const currentSignature = getStorageSignature();

    if (
      !shouldUsePostgresStorage() &&
      currentSignature !== storageSignature
    ) {
      snapshot = options.validate(
        readJsonFile(options.getFilePath(), getFallbackValue(options.fallback)),
      );
      initialized = true;
      storageSignature = currentSignature;
    }

    if (initialized && snapshot !== undefined) {
      return snapshot;
    }

    if (!initializationPromise) {
      initializationPromise = readPersistedValue(options).then((value) => {
        snapshot = value;
        initialized = true;
        storageSignature = currentSignature;
        initializationPromise = null;

        return value;
      });
    }

    return initializationPromise;
  }

  return {
    async initialize() {
      return initialize();
    },
    getSnapshot() {
      const currentSignature = getStorageSignature();

      if (
        !initialized ||
        snapshot === undefined ||
        currentSignature !== storageSignature
      ) {
        snapshot = options.validate(
          readJsonFile(options.getFilePath(), getFallbackValue(options.fallback)),
        );
        initialized = true;
        storageSignature = currentSignature;
      }

      return snapshot;
    },
    async save(value: T) {
      await initialize();
      const validated = options.validate(value);
      const persisted = await persistValue(options, validated);
      snapshot = persisted;
      initialized = true;
      storageSignature = getStorageSignature();

      return persisted;
    },
  };
}
