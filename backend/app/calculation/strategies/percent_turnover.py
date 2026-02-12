import uuid
from datetime import date
from decimal import Decimal

from app.calculation.base import CalculationStrategy


class PercentTurnoverStrategy(CalculationStrategy):
    """Calculates bonus as percentage of purchase/sales turnover."""

    async def calculate(
        self,
        agreement_id: uuid.UUID,
        period_from: date,
        period_to: date,
    ) -> Decimal:
        raise NotImplementedError("Calculation not yet implemented")
