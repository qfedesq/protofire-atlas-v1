import { join } from "node:path";

function isVercelRuntime() {
  return Boolean(process.env.VERCEL);
}

export function getRuntimeManagedFilePath(
  envVarName: string,
  repoRelativePath: string,
) {
  const envValue = process.env[envVarName]?.trim();

  if (envValue) {
    return envValue;
  }

  if (isVercelRuntime()) {
    return join("/tmp", "protofire-atlas", repoRelativePath);
  }

  return join(process.cwd(), repoRelativePath);
}
