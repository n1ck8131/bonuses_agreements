from fastapi import APIRouter, Depends

from app.api.deps import get_current_user, get_auth_service
from app.models.user import User
from app.schemas.user import LoginRequest, Token, UserResponse
from app.services.auth_service import AuthService

router = APIRouter()


@router.post("/auth/login", response_model=Token)
async def login(
    login_data: LoginRequest,
    service: AuthService = Depends(get_auth_service),
) -> dict:
    return await service.authenticate(login_data.username, login_data.password)


@router.get("/auth/me", response_model=UserResponse)
async def get_me(
    current_user: User = Depends(get_current_user),
) -> User:
    return current_user
