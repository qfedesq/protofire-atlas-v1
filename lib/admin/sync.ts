import { spawnSync } from "node:child_process";

export function runAtlasSyncNow() {
  const result = spawnSync("npm", ["run", "data:sync"], {
    cwd: process.cwd(),
    env: process.env,
    encoding: "utf-8",
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || "Atlas sync failed.");
  }

  return {
    completedAt: new Date().toISOString(),
  };
}
