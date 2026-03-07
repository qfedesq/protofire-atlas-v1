import packageJson from "@/package.json";

export const atlasVersion = {
  semver: packageJson.version,
  label: `V${packageJson.version.split(".").slice(0, 2).join(".")}`,
} as const;
