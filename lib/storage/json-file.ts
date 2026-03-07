import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname } from "node:path";

export function ensureJsonFile<T>(filePath: string, fallback: T) {
  mkdirSync(dirname(filePath), { recursive: true });

  if (!existsSync(filePath)) {
    writeJsonFile(filePath, fallback);
  }
}

export function readJsonFile<T>(filePath: string, fallback: T): T {
  ensureJsonFile(filePath, fallback);

  return JSON.parse(readFileSync(filePath, "utf8")) as T;
}

export function writeJsonFile<T>(filePath: string, value: T) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}
