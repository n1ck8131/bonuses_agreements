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
src/
├── api/          # API client (fetch-based)
├── contexts/     # React Context providers
├── types/        # TypeScript interfaces/enums
├── utils/        # Shared utility functions
├── hooks/        # Custom React hooks
└── components/
    ├── common/       # Shared components (ErrorBoundary, LoadingSpinner, ProtectedRoute)
    ├── layout/       # Layout components (Header, SubNav)
    ├── auth/         # Authentication components
    ├── dashboard/    # Dashboard components
    └── agreements/   # Agreement feature components
```

## Error Handling

Backend services raise domain exceptions (`AppError`, `NotFoundError`, `ValidationError`, `ForbiddenError`). A global FastAPI exception handler in `main.py` converts them to HTTP responses. Route handlers never import `HTTPException` directly.

## Authentication

JWT-based with bcrypt password hashing. Security functions centralized in `core/security.py`. Token validation in `api/deps.py` via `get_current_user` dependency.
