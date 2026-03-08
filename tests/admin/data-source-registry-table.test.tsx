import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DataSourceRegistryTable } from "@/components/admin/data-source-registry-table";
import { getDataSourceRegistry } from "@/lib/admin/data-source-registry";

describe("DataSourceRegistryTable", () => {
  it("renders the Atlas data provenance registry with blockchain metrics and assumptions", () => {
    render(<DataSourceRegistryTable groups={getDataSourceRegistry()} />);

    expect(screen.getByText("Benchmark and external ecosystem metrics")).toBeInTheDocument();
    expect(screen.getByText("TVL")).toBeInTheDocument();
    expect(screen.getByText("Readiness module statuses")).toBeInTheDocument();
    expect(screen.getByText("Global ranking component weights")).toBeInTheDocument();
    expect(screen.getByText("Roadmap stage")).toBeInTheDocument();
    expect(screen.getByText("Global LST health score")).toBeInTheDocument();
    expect(screen.getAllByText("seed/fallback dataset").length).toBeGreaterThan(0);
    expect(screen.getAllByText("internal manual/admin-managed assumption").length).toBeGreaterThan(0);
  });
});
