import uuid
from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import String, Enum, Numeric, CheckConstraint, ForeignKey, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.domain.enums import AgreementStatus
from app.models.reference import RefSupplier, RefAgreementType


class Agreement(Base):
    __tablename__ = "agreements"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    code: Mapped[str] = mapped_column(
        String(8),
        nullable=False,
        unique=True,
        server_default=text("LPAD(nextval('agreement_code_seq')::text, 8, '0')"),
    )
    valid_from: Mapped[date] = mapped_column(nullable=False)
    valid_to: Mapped[date] = mapped_column(nullable=False)
    supplier_code: Mapped[str] = mapped_column(
        String(20), ForeignKey("ref_suppliers.code"), nullable=False
    )
    agreement_type_code: Mapped[str] = mapped_column(
        String(20), ForeignKey("ref_agreement_types.code"), nullable=False
    )
    condition_value: Mapped[Decimal] = mapped_column(Numeric(15, 2), nullable=False)
    status: Mapped[AgreementStatus] = mapped_column(
        Enum(AgreementStatus, name="agreement_status_enum"),
        nullable=False,
        default=AgreementStatus.READY_FOR_CALCULATION,
        server_default="READY_FOR_CALCULATION",
    )
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    supplier: Mapped[RefSupplier] = relationship(lazy="joined")
    agreement_type: Mapped[RefAgreementType] = relationship(lazy="joined")

    __table_args__ = (
        CheckConstraint("valid_to >= valid_from", name="check_valid_dates"),
        CheckConstraint("condition_value > 0", name="check_condition_value_positive"),
    )
