from pydantic import BaseModel


class RefSupplierResponse(BaseModel):
    code: str
    name: str

    model_config = {"from_attributes": True}


class RefAgreementTypeResponse(BaseModel):
    code: str
    name: str

    model_config = {"from_attributes": True}


class RefScaleResponse(BaseModel):
    code: str
    name: str
    grid: str

    model_config = {"from_attributes": True}
