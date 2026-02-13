# Bonus Agreements System

MVP bonus agreements system: input, storage, management, calculation.
Technical details: [README.md](README.md) | Documentation: [docs/](docs/)

---

## Auto-Orchestrator Rule

- On receiving a task — identify affected layers (API, Services, Repositories, Models, Frontend)
- Select an agent from the table below
- If the task affects >2 layers — start with @design-scout
- If the task is ambiguous — make a reasonable engineering assumption, do not invent requirements

## Agent Selection

| Agent | When to Use |
|-------|-------------|
| @design-scout | Architectural alternatives, design tradeoffs |
| @backend-architect | Backend layering, service/repo structure |
| @database-engineer | Schema changes, migrations, indexes, SQL |
| @calculation-engine | Calc logic, strategy design, result persistence |
| @frontend-portal | React structure, components, routing, forms |
| @bug-fixer | Regressions, runtime errors, broken behavior |
| @security-guardian | Security review, OWASP validation, auth/authz checks |
| @documentation-maintainer | README, docs/, CLAUDE.md updates |
| @quality-reviewer | Architecture review, quality gate |

## MCP Usage Policy

| MCP | Purpose | When |
|-----|---------|------|
| filesystem | File operations | Always available |
| postgres | Schema inspection, read-only queries | DB design, debugging |
| git | Diff, commits, branch management | All changes |
| context7 | Modern best practices validation | Architecture decisions |
| playwright | UI verification | Frontend changes |

## Architecture Quick Reference

```
API (api/v1/) → Services (services/) → Repositories (repositories/) → Models (models/)
```

- **API** — thin route handlers, delegate to services
- **Services** — business logic, validation
- **Repositories** — data access (SQLAlchemy queries)
- **Domain** — enums, constants, exceptions
- **Core** — config, security, logging
- **Calculation** — calculation engine skeleton (Strategy pattern)

> Full structure: [docs/architecture.md](docs/architecture.md)

## Calculation Safety

- **Idempotency**
  - Re-running the same calculation with the same inputs must not create duplicates.
  - Persisted results must be deterministic for the same inputs (or explicitly versioned).
- **Uniqueness key**
  - Every persisted calculation result must have a clear identity, e.g.:
    - `(agreement_id, calculation_date, strategy_version)` or equivalent.
- **Recalculation policy**
  - Define one of:
    - **Overwrite**: delete/replace previous results for the same uniqueness key; OR
    - **Versioned**: keep history with `run_id`/`version`, and mark “active/latest”.
- **Atomic persistence**
  - Calculation run must persist results + metadata (inputs snapshot / strategy version / timestamps) in the same transaction.
- **Auditability (MVP-friendly)**
  - Store at least: `agreement_id`, `calc_date`, `strategy_name`, `strategy_version`, `run_at`, `status`, `error_message(optional)`.

## Transaction Rules

- **Transaction boundary lives in Services layer**
  - API handlers must NOT open/commit transactions directly (only call services).
- **Repositories must be side-effect free**
  - Repositories must NOT call `commit()` / `rollback()`.
  - Repositories only execute queries and return domain/db models.
- **Service orchestrates multi-repository changes atomically**
  - If an operation touches multiple repositories, it must be done within a single service-level transaction.
- **Rollback policy**
  - On any exception during a transaction, perform rollback and rethrow a domain-level exception (no raw DB errors to API).
- **Async discipline**
  - All DB work is `async`, uses a single request-scoped session.

## Running the Project

- Everything runs via Docker Compose: `docker compose up -d`
- After backend code changes (code is baked into image): `docker compose up -d --build backend`
- Migrations: `docker compose exec backend alembic upgrade head`
- Logs: `docker compose logs -f backend`
- **DO NOT** run uvicorn directly on host, **DO NOT** kill processes on port 8000 (Docker proxy)
- Details: [docs/development.md](docs/development.md)

## Development Workflow

1. **Design** → plan changes, identify affected layers
2. **Implement** → follow layer structure (api → services → repositories)
3. **Review** → verify architecture consistency
4. **Commit** → logical, focused commits

### Strict Quality Gate

**NO commits without review:**
- Before any commit: run @quality-reviewer
- Summarize review findings
- Acknowledge and address critical issues
- Only then proceed with commit
- If security-sensitive changes were made → run @security-guardian before commit.

## Coding Discipline

### General

- Be concise
- Do not invent non-existent requirements
- When ambiguous, make a reasonable engineering assumption

### Backend (Python)

- async/await for all DB operations
- Type hints are mandatory
- New endpoints: route → service → repository
- New enums: domain/enums.py
- New exceptions: domain/exceptions.py

### Frontend (TypeScript)

- strict mode is mandatory
- Components in corresponding feature folders
- Reference fields (suppliers, types, etc.) — always use `SearchableSelect` (`components/common/SearchableSelect.tsx`), not `Select`

## Optional Plugin Agents (wshobson/agents)

Specialized workflow plugins from wshobson/agents marketplace.

### Core Agents First Rule

**Prefer core domain agents over plugin tooling:**
- If a task can be solved by a core agent (@backend-architect, @security-guardian, etc.), use it first
- Use plugins only for specialized automation workflows (migrations, test generation, security scanning, refactoring tools)
- Example: security review → @security-guardian (core) before backend-api-security (plugin)

### Installation

```bash
/plugin marketplace add wshobson/agents
/plugin install database-migrations
/plugin install unit-testing
/plugin install dependency-management
/plugin install backend-api-security
/plugin install api-testing-observability
/plugin install code-refactoring
```

### When to Prefer Plugin Tooling

| Plugin | Prefer When |
| ------ | ----------- |
| database-migrations | Alembic migrations, schema changes, rollback scenarios |
| unit-testing | Writing tests, pytest fixtures, test coverage analysis |
| backend-api-security | OWASP checks, auth vulnerabilities, input validation |
| dependency-management | requirements.txt updates, npm audits, version conflicts |
| api-testing-observability | API endpoint testing, logging instrumentation |
| code-refactoring | Large-scale refactoring, extracting methods, DRY violations |

**Later (not installed):** application-performance, documentation-generation

**Governance note:** Do not import long plugin prompts into CLAUDE.md; keep governance lightweight.

## Documentation Map

| Document | Content |
|----------|---------|
| [README.md](README.md) | Quick start, tech stack, API overview, troubleshooting |
| [docs/architecture.md](docs/architecture.md) | Layer diagram, full directory trees, where to add code |
| [docs/database.md](docs/database.md) | Current schema, migrations, future calc tables |
| [docs/calculation-engine.md](docs/calculation-engine.md) | Strategy pattern, roadmap |
| [docs/development.md](docs/development.md) | Dev commands, linting, migrations, troubleshooting |
