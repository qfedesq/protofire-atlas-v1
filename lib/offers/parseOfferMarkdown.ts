import { readFileSync } from "node:fs";

import type { EconomyTypeSlug, OfferLibraryItem } from "@/lib/domain/types";

function readOfferMarkdownSections(content: string) {
  const lines = content.split("\n");
  const metadata = new Map<string, string>();
  const sections = new Map<string, string>();
  let currentSection: string | null = null;
  let currentBuffer: string[] = [];

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (currentSection) {
        sections.set(currentSection, currentBuffer.join("\n").trim());
      }
      currentSection = line.replace(/^##\s+/, "").trim();
      currentBuffer = [];
      continue;
    }

    if (!currentSection) {
      const separatorIndex = line.indexOf(":");
      if (separatorIndex > 0 && !line.startsWith("#")) {
        const key = line.slice(0, separatorIndex).trim();
        const value = line.slice(separatorIndex + 1).trim();
        metadata.set(key, value);
      }
      continue;
    }

    currentBuffer.push(line);
  }

  if (currentSection) {
    sections.set(currentSection, currentBuffer.join("\n").trim());
  }

  return { metadata, sections };
}

function parseListSection(content: string) {
  return content
    .split("\n")
    .map((line) => line.replace(/^- /, "").trim())
    .filter(Boolean);
}

function slugFromFileName(fileName: string) {
  return fileName.replace(/\.md$/, "");
}

export function parseOfferMarkdown(params: {
  fileName: string;
  sourceFile: string;
  content?: string;
}): OfferLibraryItem {
  const { fileName, sourceFile } = params;
  const content = params.content ?? readFileSync(sourceFile, "utf8");
  const { metadata, sections } = readOfferMarkdownSections(content);

  return {
    offerId: slugFromFileName(fileName),
    name: metadata.get("Offer Name") ?? slugFromFileName(fileName),
    isActive: true,
    targetCustomer: metadata.get("Target Customer") ?? "Unknown",
    applicableWedges: (metadata.get("Applicable Wedges") ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean) as EconomyTypeSlug[],
    targetPersonas: (metadata.get("Target Personas") ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
    priceRange: metadata.get("Typical Price Range") ?? "Not specified",
    roiEstimate: metadata.get("ROI Potential") ?? "Not specified",
    caseStudyReferences: (metadata.get("Case Study References") ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
    problemSolved: sections.get("Problem Solved") ?? "",
    technicalRequirements: parseListSection(
      sections.get("Infrastructure Required") ?? "",
    ),
    deploymentScope: sections.get("Deployment Scope") ?? "",
    implementationScope: sections.get("Implementation Scope") ?? "",
    expectedImpact: sections.get("Expected Impact") ?? "",
    sourceFile,
  };
}
