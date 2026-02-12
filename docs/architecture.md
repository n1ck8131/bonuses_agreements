# Architecture

## Backend Layers

```
API (api/v1/)  →  Services (services/)  →  Repositories (repositories/)  →  Models (models/)
     ↑                    ↑                         ↑                           ↑
  Thin routes       Business logic           Data access              SQLAlchemy ORM
  FastAPI deps      Validation               Raw queries              DB schema
```

### Layer Responsibilities

| Layer | Location | Responsibility |
|-------|----------|----------------|
| **API** | `app/api/v1/` | HTTP routing, request/response serialization, dependency injection |
| **Services** | `app/services/` | Business logic, validation, orchestration |
| **Repositories** | `app/repositories/` | Database queries, CRUD operations |
| **Models** | `app/models/` | SQLAlchemy ORM definitions |
| **Schemas** | `app/schemas/` | Pydantic request/response validation |
| **Domain** | `app/domain/` | Enums, constants, custom exceptions |
| **Core** | `app/core/` | Configuration, security, logging |
| **Calculation** | `app/calculation/` | Bonus calculation engine (skeleton) |

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

### Adding New Features

**New endpoint:**
1. Add route in `api/v1/`
2. Add service in `services/`
3. Add repo method in `repositories/`

**New business rule:** goes in `services/`

**New database query:** goes in `repositories/`

**New enum:** goes in `domain/enums.py`

**New exception:** goes in `domain/exceptions.py`

## Frontend Structure

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

## Error Handling

Backend services raise domain exceptions (`AppError`, `NotFoundError`, `ValidationError`, `ForbiddenError`). A global FastAPI exception handler in `main.py` converts them to HTTP responses. Route handlers never import `HTTPException` directly.

## Authentication

JWT-based with bcrypt password hashing. Security functions centralized in `core/security.py`. Token validation in `api/deps.py` via `get_current_user` dependency.
