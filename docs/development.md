# Development Guide

> Quick start, service URLs and credentials: see [README.md](../README.md#quick-start)

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

### Starting Dev Server

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
