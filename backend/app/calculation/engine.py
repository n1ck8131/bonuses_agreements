import uuid
from datetime import date
from decimal import Decimal

from app.calculation.base import CalculationStrategy


class CalculationEngine:
    """Dispatches calculation to the appropriate strategy based on agreement type."""

    _strategies: dict[str, type[CalculationStrategy]] = {}

    @classmethod
    def register(cls, agreement_type_code: str, strategy: type[CalculationStrategy]) -> None:
        cls._strategies[agreement_type_code] = strategy

    async def run(
        self,
        agreement_id: uuid.UUID,
        period_from: date,
        period_to: date,
    ) -> Decimal:
        # Future implementation:
        # 1. Load agreement from DB
        # 2. Look up strategy by agreement_type_code
        # 3. Delegate to strategy.calculate()
        raise NotImplementedError("Engine not yet implemented")
