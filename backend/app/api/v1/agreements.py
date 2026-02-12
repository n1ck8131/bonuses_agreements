import uuid

from fastapi import APIRouter, Depends

from app.api.deps import get_current_user, get_agreement_service
from app.models.user import User
from app.schemas.agreement import (
    AgreementCreate,
    AgreementUpdate,
    AgreementStatusUpdate,
    AgreementResponse,
)
from app.services.agreement_service import AgreementService

router = APIRouter()


@router.post("/agreements", response_model=AgreementResponse, status_code=201)
async def create_agreement(
    data: AgreementCreate,
    service: AgreementService = Depends(get_agreement_service),
    current_user: User = Depends(get_current_user),
) -> AgreementResponse:
    agreement = await service.create(data)
    return AgreementResponse.model_validate(agreement)


@router.get("/agreements", response_model=list[AgreementResponse])
async def get_agreements(
    service: AgreementService = Depends(get_agreement_service),
    current_user: User = Depends(get_current_user),
) -> list[AgreementResponse]:
    agreements = await service.get_all()
    return [AgreementResponse.model_validate(a) for a in agreements]


@router.get("/agreements/{agreement_id}", response_model=AgreementResponse)
async def get_agreement(
    agreement_id: uuid.UUID,
    service: AgreementService = Depends(get_agreement_service),
    current_user: User = Depends(get_current_user),
) -> AgreementResponse:
    agreement = await service.get_by_id(agreement_id)
    return AgreementResponse.model_validate(agreement)


@router.put("/agreements/{agreement_id}", response_model=AgreementResponse)
async def update_agreement(
    agreement_id: uuid.UUID,
    data: AgreementUpdate,
    service: AgreementService = Depends(get_agreement_service),
    current_user: User = Depends(get_current_user),
) -> AgreementResponse:
    agreement = await service.update(agreement_id, data)
    return AgreementResponse.model_validate(agreement)


@router.patch("/agreements/{agreement_id}/status", response_model=AgreementResponse)
async def update_agreement_status(
    agreement_id: uuid.UUID,
    data: AgreementStatusUpdate,
    service: AgreementService = Depends(get_agreement_service),
    current_user: User = Depends(get_current_user),
) -> AgreementResponse:
    agreement = await service.update_status(agreement_id, data.status)
    return AgreementResponse.model_validate(agreement)
