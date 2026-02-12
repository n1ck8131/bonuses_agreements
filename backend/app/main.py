from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.agreements import router as agreements_router
from app.api.v1.auth import router as auth_router
from app.api.v1.reference import router as reference_router
from app.core.config import settings
from app.core.logging import setup_logging
from app.db.session import AsyncSessionLocal
from app.domain.exceptions import AppError
from app.repositories.user_repo import UserRepository
from app.services.auth_service import AuthService


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging()
    async with AsyncSessionLocal() as session:
        auth_service = AuthService(user_repo=UserRepository(session))
        await auth_service.ensure_admin_exists()
    yield


app = FastAPI(title="Bonus Agreements API", lifespan=lifespan)


@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agreements_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(reference_router, prefix="/api")
