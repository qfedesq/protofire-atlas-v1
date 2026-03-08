# Repository Setup

## Naming convention

The GitHub repository name for this release line must end with `-v1`.

Recommended name:

- `protofire-atlas-v1`

The local package/release line already uses:

- [`package.json`](/Users/qfedesq/Desktop/Atlas/package.json) → `protofire-atlas-v1`

## Current local status

- git repository is already initialized
- remote `origin` points to `https://github.com/qfedesq/protofire-atlas-v1.git`
- branch used for this phase: `codex/roadmap-fit-v1-6`

## Manual GitHub setup

If you need to recreate the GitHub remote manually, run:

```bash
gh repo create protofire-atlas-v1 --private --source=. --remote=origin --push
```

If the repository already exists:

```bash
git remote add origin git@github.com:<org>/protofire-atlas-v1.git
git push -u origin main
```

## Branch / commit / merge workflow

For every completed update:

1. Create a branch.
   - preferred prefix: `codex/`
2. Implement the change.
3. Bump the version by `+0.1` if the update is complete.
4. Run:

```bash
npm run check
npm run build
```

5. Commit with a clear conventional message.
6. Push the branch.
7. Merge into `main` only after review or explicit approval.

## Versioning convention

Atlas uses the package version as the canonical version source.

Examples:

- `1.0.0` → public label `V1.0`
- `1.1.0` → public label `V1.1`
- `1.6.0` → public label `V1.6`

Helper command:

```bash
npm run version:bump
```

That script increments the minor version and updates both:

- [`package.json`](/Users/qfedesq/Desktop/Atlas/package.json)
- [`package-lock.json`](/Users/qfedesq/Desktop/Atlas/package-lock.json)
