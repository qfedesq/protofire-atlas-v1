import { describe, expect, it } from "vitest";

import packageJson from "@/package.json";
import { atlasVersion } from "@/lib/config/version";

describe("atlas version", () => {
  it("derives the public label from package metadata", () => {
    expect(atlasVersion.semver).toBe(packageJson.version);
    expect(atlasVersion.label).toBe(
      `V${packageJson.version.split(".").slice(0, 2).join(".")}`,
    );
  });
});
