from sqlalchemy import String, Enum
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.domain.enums import GridType


class RefSupplier(Base):
    __tablename__ = "ref_suppliers"

    code: Mapped[str] = mapped_column(String(20), primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)


class RefAgreementType(Base):
    __tablename__ = "ref_agreement_types"

    code: Mapped[str] = mapped_column(String(20), primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    grid: Mapped[GridType] = mapped_column(
        Enum(GridType, name="grid_type_enum"), nullable=False
    )
