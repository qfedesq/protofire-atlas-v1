import { readFileSync, writeFileSync } from "node:fs";

const packageJsonPath = new URL("../package.json", import.meta.url);
const packageLockPath = new URL("../package-lock.json", import.meta.url);

function bumpMinor(version) {
  const [major, minor] = version.split(".").map(Number);
  return `${major}.${minor + 1}.0`;
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
const nextVersion = bumpMinor(packageJson.version);

packageJson.version = nextVersion;
writeJson(packageJsonPath, packageJson);

const packageLock = JSON.parse(readFileSync(packageLockPath, "utf8"));
packageLock.name = packageJson.name;
packageLock.version = nextVersion;

if (packageLock.packages?.[""]) {
  packageLock.packages[""].name = packageJson.name;
  packageLock.packages[""].version = nextVersion;
}

writeJson(packageLockPath, packageLock);

console.log(`Bumped Atlas version to ${nextVersion}.`);
