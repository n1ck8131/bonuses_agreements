from typing import AsyncGenerator

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.session import AsyncSessionLocal
from app.models.user import User
from app.repositories.agreement_repo import AgreementRepository
from app.repositories.reference_repo import ReferenceRepository
from app.repositories.user_repo import UserRepository
from app.services.agreement_service import AgreementService
from app.services.auth_service import AuthService
from app.services.reference_service import ReferenceService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        username: str | None = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user_repo = UserRepository(db)
    user = await user_repo.get_by_username(username)

    if user is None or not user.is_active:
        raise credentials_exception

    return user


def get_agreement_service(db: AsyncSession = Depends(get_db)) -> AgreementService:
    return AgreementService(
        agreement_repo=AgreementRepository(db),
        reference_repo=ReferenceRepository(db),
    )


def get_auth_service(db: AsyncSession = Depends(get_db)) -> AuthService:
    return AuthService(user_repo=UserRepository(db))


def get_reference_service(db: AsyncSession = Depends(get_db)) -> ReferenceService:
    return ReferenceService(reference_repo=ReferenceRepository(db))
