# Contributing

Thanks for improving The People's Election Guide.

## Principles

- Keep content nonpartisan and civic-focused.
- Prefer plain language over technical jargon.
- Never hardcode secrets.
- Preserve accessibility and mobile-first behavior.

## Development Workflow (Spec-First)

1. Update API contract first in lib/api-spec/openapi.yaml.
2. Regenerate clients and schemas:

```bash
pnpm --filter @workspace/api-spec run codegen
```

3. Implement server/client code using generated types from:
- @workspace/api-zod
- @workspace/api-client-react

4. Add or update tests for behavior changes.
5. Run local validation before opening a PR:

```bash
pnpm run typecheck
pnpm run lint
pnpm run test
pnpm run build
```

## Commit Style

Use Conventional Commits where possible:
- feat:
- fix:
- test:
- docs:
- ci:
- chore:

## Pull Requests

- Keep PRs focused and reasonably small.
- Explain user impact and architectural impact.
- Link issues or context when available.
- Include screenshots for UI changes.

## Security

Do not disclose vulnerabilities publicly before maintainers have time to patch.
See SECURITY.md for reporting instructions.
