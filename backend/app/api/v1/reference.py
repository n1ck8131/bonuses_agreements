from fastapi import APIRouter, Depends

from app.api.deps import get_current_user, get_reference_service
from app.models.user import User
from app.schemas.reference import RefSupplierResponse, RefAgreementTypeResponse, RefScaleResponse
from app.services.reference_service import ReferenceService

router = APIRouter()


@router.get("/ref/suppliers", response_model=list[RefSupplierResponse])
async def get_suppliers(
    service: ReferenceService = Depends(get_reference_service),
    current_user: User = Depends(get_current_user),
) -> list:
    return await service.get_all_suppliers()


@router.get("/ref/agreement-types", response_model=list[RefAgreementTypeResponse])
async def get_agreement_types(
    service: ReferenceService = Depends(get_reference_service),
    current_user: User = Depends(get_current_user),
) -> list:
    return await service.get_all_agreement_types()


@router.get("/ref/scales", response_model=list[RefScaleResponse])
async def get_scales(
    service: ReferenceService = Depends(get_reference_service),
    current_user: User = Depends(get_current_user),
) -> list:
    return await service.get_all_scales()
