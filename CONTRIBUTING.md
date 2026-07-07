# Contributing

Thanks for considering contributing to inode-cli. This project
is early, moving daily, and intentionally built to make outside contribution
easy once it's ready for it.

## Development setup

```bash
npm install
npm run build
npm test
```

- Node >= 18
- TypeScript throughout — no Rust, no Go, on purpose (see `docs/plan.md`)
- `npm run lint` / `npm run format` before committing

## Commit conventions

Every commit message should answer one question: _what does this commit do?_

Format: `type(scope): short description`

```
feat(parser): parse git flags
fix(rules): correct force-push detection
docs(readme): clarify install steps
test(parser): cover quoted arguments
chore: initialize project
```

Avoid non-descriptive messages like `update`, `fix`, `misc`, `changes`.

Common types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`.
Common scopes: `parser`, `rules`, `predictor`, `output`, `context`, `cli`.

## Issue labels

Every issue should have exactly one label:

| Label              | Meaning                                   |
| ------------------ | ----------------------------------------- |
| `bug`              | Something isn't working                   |
| `enhancement`      | New feature or improvement                |
| `rule`             | A new or updated risk rule                |
| `git`              | Git-specific behavior                     |
| `docker`           | Docker-specific behavior                  |
| `good first issue` | Small, well-scoped, good entry point      |
| `research`         | Needs investigation before implementation |
| `blocked`          | Waiting on something else                 |

## What we're not doing (yet)

See "Deferred Ideas" in `docs/plan.md` — Docker, Kubernetes, SQL migrations,
Terraform, historical learning, team mode, and a VS Code extension are all
intentionally out of scope for the MVP. If you'd like to work on one of
these, please open a `research` issue first so we can align on scope.

## Ground rule

No feature is implemented until its user value can be explained in one
sentence. If you can't explain why a change helps someone feel safer before
running a command, it's probably not ready yet.
