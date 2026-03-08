import { describe, expect, it } from "vitest";

import { atlasVersion } from "@/lib/config/version";

describe("atlas version", () => {
  it("derives the public label from package metadata", () => {
    expect(atlasVersion.semver).toBe("1.3.0");
    expect(atlasVersion.label).toBe("V1.3");
  });
});
