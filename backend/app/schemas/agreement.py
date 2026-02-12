import uuid
from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, Field, field_validator, model_validator

from app.domain.enums import AgreementStatus


class AgreementBase(BaseModel):
    valid_from: date
    valid_to: date
    supplier_code: str = Field(..., min_length=1)
    agreement_type_code: str = Field(..., min_length=1)
    condition_value: Decimal = Field(..., gt=0)

    @field_validator("valid_to")
    @classmethod
    def validate_dates(cls, v: date, info) -> date:
        valid_from = info.data.get("valid_from")
        if valid_from and v < valid_from:
            raise ValueError("valid_to must be >= valid_from")
        return v


class AgreementCreate(AgreementBase):
    pass


class AgreementUpdate(AgreementBase):
    pass


class AgreementStatusUpdate(BaseModel):
    status: AgreementStatus


class AgreementResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    valid_from: date
    valid_to: date
    supplier_code: str
    supplier_name: str
    agreement_type_code: str
    agreement_type_name: str
    agreement_type_grid: str
    condition_value: Decimal
    status: AgreementStatus
    created_at: datetime
    updated_at: datetime

    @model_validator(mode="before")
    @classmethod
    def flatten_relations(cls, data: object) -> object:
        if hasattr(data, "supplier") and data.supplier is not None:
            data.supplier_name = data.supplier.name
        if hasattr(data, "agreement_type") and data.agreement_type is not None:
            data.agreement_type_name = data.agreement_type.name
            data.agreement_type_grid = data.agreement_type.grid.value
        return data
