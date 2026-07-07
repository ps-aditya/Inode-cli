# Integration tests

Unit tests live next to their source in each package
(`packages/*/src/**/*.test.ts`). This directory is for cross-package /
end-to-end tests once the full pipeline (parser → rules → predictor →
output) exists — e.g. running the actual CLI binary against a fixture repo.

Empty for now on purpose: Sprint 1 only ships the parser, which is already
covered by `packages/parser/src/index.test.ts`.
