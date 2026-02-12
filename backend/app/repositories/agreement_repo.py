import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.agreement import Agreement


class AgreementRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create(self, agreement: Agreement) -> Agreement:
        self.db.add(agreement)
        await self.db.commit()
        await self.db.refresh(agreement)
        return agreement

    async def get_all(self) -> list[Agreement]:
        result = await self.db.execute(
            select(Agreement).order_by(Agreement.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_by_id(self, agreement_id: uuid.UUID) -> Agreement | None:
        result = await self.db.execute(
            select(Agreement).where(Agreement.id == agreement_id)
        )
        return result.scalars().first()

    async def update(self, agreement: Agreement) -> Agreement:
        await self.db.commit()
        await self.db.refresh(agreement)
        return agreement
