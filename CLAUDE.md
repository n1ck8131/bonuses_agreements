# Bonus Agreements System

MVP системы бонусных соглашений: ввод, хранение, управление, расчёт.
Технические детали: [README.md](README.md) | Документация: [docs/](docs/)

---

## Auto-Orchestrator Rule

- При получении задачи — определить затронутые слои (API, Services, Repositories, Models, Frontend)
- Выбрать агента из таблицы ниже
- Если задача затрагивает >2 слоёв — начать с @design-scout
- Если задача неоднозначна — сделать разумное инженерное допущение, не выдумывать требования

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

- **API** — тонкие route handlers, делегируют в services
- **Services** — бизнес-логика, валидация
- **Repositories** — доступ к данным (SQLAlchemy queries)
- **Domain** — enums, constants, exceptions
- **Core** — config, security, logging
- **Calculation** — скелет расчётного движка (Strategy pattern)

> Полная структура: [docs/architecture.md](docs/architecture.md)

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

## Coding Discipline

### General

- Отвечать лаконично
- Не выдумывать несуществующие требования
- При неоднозначности делать разумное инженерное допущение

### Backend (Python)

- async/await для всех DB операций
- Type hints обязательны
- Новые endpoints: route → service → repository
- Новые enums: domain/enums.py
- Новые исключения: domain/exceptions.py

### Frontend (TypeScript)

- strict mode обязателен
- Компоненты в соответствующих feature-папках

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
