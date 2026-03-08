import { spawnSync } from "node:child_process";

const steps = [
  {
    label: "Top 30 EVM snapshot",
    command: "npm",
    args: ["run", "data:refresh-top30"],
  },
  {
    label: "External ecosystem metrics snapshot",
    command: "npm",
    args: ["run", "data:sync-external"],
  },
  {
    label: "Reports and exports",
    command: "npm",
    args: ["run", "reports:generate"],
  },
];

for (const step of steps) {
  const result = spawnSync(step.command, step.args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: "inherit",
    encoding: "utf-8",
  });

  if (result.status !== 0) {
    throw new Error(`Atlas sync failed during ${step.label}.`);
  }
}
