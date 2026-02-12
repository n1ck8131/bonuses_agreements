# Project: Bonus Agreements System

## Overview

MVP системы ввода, хранения и управления бонусными соглашениями. Подготовлен к расширению: новые таблицы, расчётный движок, новые страницы портала.

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (для frontend)

### Запуск проекта

```bash
# Backend + PostgreSQL
docker-compose up -d

# Frontend
cd frontend
npm install --force
npm start
```

**Доступ к сервисам:**

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- PostgreSQL: localhost:5432
- Credentials: admin / admin

## Technology Stack

### Backend (Dockerized)

- Python 3.12, FastAPI (async), SQLAlchemy 2.0 (async) + asyncpg
- PostgreSQL 16, Alembic (миграции), Pydantic (валидация)
- JWT auth (python-jose + passlib/bcrypt)
- Ruff (linting)

### Frontend (Local Dev Server)

- React 18 + TypeScript (strict mode)
- MUI (Material UI), React Router, native fetch API
- dayjs (даты), Prettier (formatting)

## Architecture

### Backend Layers

```
API (api/v1/)  →  Services (services/)  →  Repositories (repositories/)  →  Models (models/)
```

- **API** — тонкие route handlers, делегируют в services
- **Services** — бизнес-логика, валидация
- **Repositories** — доступ к данным (SQLAlchemy queries)
- **Domain** — enums, constants, exceptions
- **Core** — config, security, logging
- **Calculation** — скелет расчётного движка (Strategy pattern)

### Backend Structure

```
backend/app/
├── main.py                    # FastAPI app, middleware, exception handler
├── core/
│   ├── config.py              # Pydantic Settings
│   ├── security.py            # JWT, bcrypt, password helpers
│   └── logging.py             # Structured logging setup
├── domain/
│   ├── enums.py               # AgreementStatus, GridType
│   ├── constants.py           # Default admin credentials
│   └── exceptions.py          # AppError, NotFoundError, ValidationError, ForbiddenError
├── db/
│   ├── base.py                # DeclarativeBase
│   └── session.py             # Async engine + session factory
├── models/
│   ├── agreement.py           # Agreement ORM model
│   ├── user.py                # User ORM model
│   └── reference.py           # RefSupplier, RefAgreementType
├── repositories/
│   ├── agreement_repo.py      # Agreement CRUD
│   ├── user_repo.py           # User queries
│   └── reference_repo.py      # Reference data queries
├── services/
│   ├── agreement_service.py   # Agreement business logic
│   ├── auth_service.py        # Authentication + admin seeding
│   └── reference_service.py   # Reference data service
├── schemas/
│   ├── agreement.py           # AgreementBase/Create/Update/Response
│   ├── user.py                # LoginRequest, Token, UserResponse
│   └── reference.py           # RefSupplier/AgreementType responses
├── api/
│   ├── deps.py                # DI: get_db, get_current_user, service factories
│   └── v1/
│       ├── agreements.py      # Agreement endpoints
│       ├── auth.py            # Auth endpoints
│       └── reference.py       # Reference data endpoints
└── calculation/
    ├── base.py                # CalculationStrategy ABC
    ├── engine.py              # CalculationEngine dispatcher
    └── strategies/
        └── percent_turnover.py  # Skeleton strategy
```

### Frontend Structure

```
frontend/src/
├── App.tsx                    # Root with routing + ErrorBoundary
├── theme.ts                   # MUI theme configuration
├── api/
│   └── client.ts              # Fetch-based API client
├── contexts/
│   └── AuthContext.tsx         # Auth state management
├── types/
│   ├── auth.ts                # Auth interfaces
│   └── agreement.ts           # Agreement types
├── utils/
│   ├── formatters.ts          # formatDate, formatDateTime, formatCondition
│   └── statusConfig.ts        # Agreement status label/color map
├── hooks/
│   └── useReferenceData.ts    # Shared hook for suppliers + agreement types
└── components/
    ├── common/
    │   ├── ErrorBoundary.tsx
    │   ├── LoadingSpinner.tsx
    │   └── ProtectedRoute.tsx
    ├── layout/
    │   ├── Header.tsx
    │   └── SubNav.tsx
    ├── auth/
    │   └── LoginPage.tsx
    ├── dashboard/
    │   └── Dashboard.tsx
    └── agreements/
        ├── AgreementsList.tsx
        ├── AgreementDetail.tsx
        ├── CreateAgreement.tsx
        └── AgreementForm.tsx    # Shared form component
```

## Multi-Agent Development

### Available Agents

| Agent | When to Use |
|-------|-------------|
| @design-scout | Architectural alternatives, design tradeoffs |
| @backend-architect | Backend layering, service/repo structure |
| @database-engineer | Schema changes, migrations, indexes, SQL |
| @calculation-engine | Calc logic, strategy design, result persistence |
| @frontend-portal | React structure, components, routing, forms |
| @bug-fixer | Regressions, runtime errors, broken behavior |
| @documentation-maintainer | README, docs/, CLAUDE.md updates |
| @quality-reviewer | Architecture review, quality gate |

### Available MCP

| MCP | Purpose |
|-----|---------|
| filesystem | File operations |
| postgres | Schema inspection, read-only queries |
| git | Diff, commits, branch management |
| context7 | Modern best practices validation |
| playwright | UI verification |

### Development Workflow

1. **Design** → plan changes, identify affected layers
2. **Implement** → follow layer structure (api → services → repositories)
3. **Review** → verify architecture consistency
4. **Commit** → logical, focused commits

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/login | Authenticate, get JWT token |
| GET | /api/auth/me | Current user info |
| GET | /api/ref/suppliers | List all suppliers |
| GET | /api/ref/agreement-types | List agreement types |
| POST | /api/agreements | Create agreement |
| GET | /api/agreements | List agreements |
| GET | /api/agreements/{id} | Get agreement detail |
| PUT | /api/agreements/{id} | Update agreement |
| PATCH | /api/agreements/{id}/status | Change agreement status |

## Code Guidelines

- Отвечать лаконично
- Не выдумывать несуществующие требования
- При неоднозначности делать разумное инженерное допущение
- async/await для всех DB операций
- Type hints обязательны в Python
- TypeScript strict mode для frontend
- Новые endpoints: route → service → repository
- Новые enums: domain/enums.py
- Новые исключения: domain/exceptions.py

## Known Issues

1. **TypeScript version conflict:** react-scripts@5.0.1 требует TypeScript 4.x, проект использует 5.x → `npm install --force`
2. **Node.js PATH на Windows:** может потребоваться перезапуск терминала

## Documentation

- [docs/architecture.md](docs/architecture.md) — layer diagram, where to add code
- [docs/database.md](docs/database.md) — current schema + future calc tables
- [docs/calculation-engine.md](docs/calculation-engine.md) — strategy pattern, roadmap
- [docs/development.md](docs/development.md) — dev workflow, commands, troubleshooting
