from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.reference import RefSupplier, RefAgreementType


class ReferenceRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_all_suppliers(self) -> list[RefSupplier]:
        result = await self.db.execute(select(RefSupplier).order_by(RefSupplier.code))
        return list(result.scalars().all())

    async def get_all_agreement_types(self) -> list[RefAgreementType]:
        result = await self.db.execute(select(RefAgreementType).order_by(RefAgreementType.code))
        return list(result.scalars().all())

    async def get_supplier_by_code(self, code: str) -> RefSupplier | None:
        return await self.db.get(RefSupplier, code)

    async def get_agreement_type_by_code(self, code: str) -> RefAgreementType | None:
        return await self.db.get(RefAgreementType, code)
