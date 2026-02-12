import logging

from app.core.security import verify_password, hash_password, create_access_token
from app.domain.constants import DEFAULT_ADMIN_USERNAME, DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD
from app.domain.exceptions import AppError, ForbiddenError
from app.models.user import User
from app.repositories.user_repo import UserRepository

logger = logging.getLogger(__name__)


class AuthService:
    def __init__(self, user_repo: UserRepository) -> None:
        self.user_repo = user_repo

    async def authenticate(self, username: str, password: str) -> dict:
        user = await self.user_repo.get_by_username(username)

        if not user or not verify_password(password, user.hashed_password):
            raise AppError("Неверное имя пользователя или пароль", status_code=401)

        if not user.is_active:
            raise ForbiddenError("Учётная запись отключена")

        access_token = create_access_token(data={"sub": user.username})
        return {"access_token": access_token, "token_type": "bearer"}

    async def ensure_admin_exists(self) -> None:
        existing = await self.user_repo.get_by_username(DEFAULT_ADMIN_USERNAME)
        if existing is None:
            admin = User(
                username=DEFAULT_ADMIN_USERNAME,
                email=DEFAULT_ADMIN_EMAIL,
                hashed_password=hash_password(DEFAULT_ADMIN_PASSWORD),
                is_active=True,
                is_admin=True,
            )
            await self.user_repo.create(admin)
            logger.info("Default admin user created (username: admin, password: admin)")
        else:
            logger.info("Admin user already exists, skipping creation")
