# Development Guide

## Prerequisites

- Docker & Docker Compose
- Node.js 18+

## Quick Start

```bash
# Backend + PostgreSQL
docker-compose up -d

# Frontend
cd frontend
npm install --force
npm start
```

## Development Workflow

1. **Design** — plan the change, identify affected layers
2. **Implement** — write code following the layer structure
3. **Review** — check architecture consistency
4. **Commit** — logical, focused commits

## Backend Development

### Running
```bash
docker-compose up -d
docker-compose logs -f backend  # watch logs
```

### Linting
```bash
cd backend
pip install ruff
ruff check .
ruff format .
```

### Database Migrations
```bash
# Create new migration
docker-compose exec backend alembic revision --autogenerate -m "description"

# Apply migrations
docker-compose exec backend alembic upgrade head
```

## Frontend Development

### Running
```bash
cd frontend
npm start       # dev server on :3000
npm run build   # production build
```

### Linting & Formatting
```bash
npm run lint     # ESLint
npm run format   # Prettier
```

## Project URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| PostgreSQL | localhost:5432 |

## Default Credentials

- Username: `admin`
- Password: `admin`

## Troubleshooting

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
