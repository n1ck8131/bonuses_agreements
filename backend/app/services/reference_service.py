from app.models.reference import RefSupplier, RefAgreementType
from app.repositories.reference_repo import ReferenceRepository


class ReferenceService:
    def __init__(self, reference_repo: ReferenceRepository) -> None:
        self.reference_repo = reference_repo

    async def get_all_suppliers(self) -> list[RefSupplier]:
        return await self.reference_repo.get_all_suppliers()

    async def get_all_agreement_types(self) -> list[RefAgreementType]:
        return await self.reference_repo.get_all_agreement_types()
