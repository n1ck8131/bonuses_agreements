import uuid

from app.domain.enums import AgreementStatus, GridType
from app.domain.exceptions import NotFoundError, ValidationError, AppError
from app.models.agreement import Agreement
from app.repositories.agreement_repo import AgreementRepository
from app.repositories.reference_repo import ReferenceRepository
from app.schemas.agreement import AgreementCreate, AgreementUpdate


class AgreementService:
    def __init__(
        self,
        agreement_repo: AgreementRepository,
        reference_repo: ReferenceRepository,
    ) -> None:
        self.agreement_repo = agreement_repo
        self.reference_repo = reference_repo

    async def _validate_refs(
        self,
        supplier_code: str,
        agreement_type_code: str,
        condition_value: float,
    ) -> None:
        supplier = await self.reference_repo.get_supplier_by_code(supplier_code)
        if not supplier:
            raise ValidationError("Invalid supplier_code")

        agreement_type = await self.reference_repo.get_agreement_type_by_code(agreement_type_code)
        if not agreement_type:
            raise ValidationError("Invalid agreement_type_code")

        if agreement_type.grid == GridType.PERCENT and condition_value > 100:
            raise ValidationError("For PERCENT grid, condition_value must be <= 100")

    async def create(self, data: AgreementCreate) -> Agreement:
        await self._validate_refs(
            data.supplier_code, data.agreement_type_code, float(data.condition_value),
        )
        agreement = Agreement(**data.model_dump())
        result = await self.agreement_repo.create(agreement)
        await self.agreement_repo.db.commit()
        return result

    async def get_all(self) -> list[Agreement]:
        return await self.agreement_repo.get_all()

    async def get_by_id(self, agreement_id: uuid.UUID) -> Agreement:
        agreement = await self.agreement_repo.get_by_id(agreement_id)
        if not agreement:
            raise NotFoundError("Agreement not found")
        return agreement

    async def update(self, agreement_id: uuid.UUID, data: AgreementUpdate) -> Agreement:
        agreement = await self.get_by_id(agreement_id)

        if agreement.status == AgreementStatus.DELETED:
            raise AppError("Cannot edit a deleted agreement", status_code=400)

        await self._validate_refs(
            data.supplier_code, data.agreement_type_code, float(data.condition_value),
        )

        for field, value in data.model_dump().items():
            setattr(agreement, field, value)

        result = await self.agreement_repo.update(agreement)
        await self.agreement_repo.db.commit()
        return result

    async def update_status(self, agreement_id: uuid.UUID, status: AgreementStatus) -> Agreement:
        agreement = await self.get_by_id(agreement_id)
        agreement.status = status
        result = await self.agreement_repo.update(agreement)
        await self.agreement_repo.db.commit()
        return result
