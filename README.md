# Bonus Agreements System

## Overview

MVP системы ввода, хранения и управления бонусными соглашениями.
Подготовлен к расширению: новые таблицы, расчётный движок, новые страницы портала.

## Tech Stack

### Backend (Dockerized)

- Python 3.12, FastAPI (async), SQLAlchemy 2.0 (async) + asyncpg
- PostgreSQL 16, Alembic (миграции), Pydantic (валидация)
- JWT auth (python-jose + passlib/bcrypt)
- Ruff (linting)

### Frontend (Local Dev Server)

- React 18 + TypeScript (strict mode)
- MUI (Material UI), React Router, native fetch API
- dayjs (даты), Prettier (formatting)

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

## Services & Access

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| PostgreSQL | localhost:5432 |

### Default Credentials

- Username: `admin`
- Password: `admin`

## Environment Configuration

Configurable via `.env` in project root:

| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_USER` | postgres | Database user |
| `POSTGRES_PASSWORD` | postgres | Database password |
| `POSTGRES_DB` | bonuses | Database name |
| `CORS_ORIGINS` | http://localhost:3000 | Allowed CORS origins |
| `JWT_SECRET_KEY` | super-secret-key-change-in-production | JWT signing key |

## Architecture Overview

```
API (api/v1/)  →  Services (services/)  →  Repositories (repositories/)  →  Models (models/)
```

Full architecture details: [docs/architecture.md](docs/architecture.md)

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Authenticate, get JWT token |
| GET | `/api/auth/me` | Current user info |
| GET | `/api/ref/suppliers` | List all suppliers |
| GET | `/api/ref/agreement-types` | List agreement types |
| POST | `/api/agreements` | Create agreement |
| GET | `/api/agreements` | List agreements |
| GET | `/api/agreements/{id}` | Get agreement detail |
| PUT | `/api/agreements/{id}` | Update agreement |
| PATCH | `/api/agreements/{id}/status` | Change agreement status |

Interactive API docs: http://localhost:8000/docs

## Development Commands

| Action | Command |
|--------|---------|
| Start backend | `docker-compose up -d` |
| Watch backend logs | `docker-compose logs -f backend` |
| Start frontend | `cd frontend && npm start` |
| Backend lint | `cd backend && ruff check . && ruff format .` |
| Frontend lint | `cd frontend && npm run lint` |
| Frontend format | `cd frontend && npm run format` |
| Create migration | `docker-compose exec backend alembic revision --autogenerate -m "desc"` |
| Apply migrations | `docker-compose exec backend alembic upgrade head` |
| Production build | `cd frontend && npm run build` |

## Troubleshooting

### TypeScript version conflict

react-scripts@5.0.1 требует TypeScript 4.x, проект использует 5.x.
**Fix:** Always use `npm install --force`

### Node.js PATH on Windows

Может потребоваться перезапуск терминала после установки Node.js.

### Backend not starting

```bash
docker-compose down -v
docker-compose up -d --build
```

### Migration "type already exists"

```bash
docker-compose down -v
docker-compose build --no-cache backend
docker-compose up -d
```

### Frontend not compiling

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install --force
npm start
```

See [docs/development.md](docs/development.md) for additional development details.

## Documentation

| Document | Content |
|----------|---------|
| [docs/architecture.md](docs/architecture.md) | Layer diagram, directory trees, where to add code |
| [docs/database.md](docs/database.md) | Current schema, migrations, future calc tables |
| [docs/calculation-engine.md](docs/calculation-engine.md) | Strategy pattern, roadmap |
| [docs/development.md](docs/development.md) | Dev commands, linting, migrations |
