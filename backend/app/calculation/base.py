import uuid
from abc import ABC, abstractmethod
from datetime import date
from decimal import Decimal


class CalculationStrategy(ABC):
    """Base class for bonus calculation strategies."""

    @abstractmethod
    async def calculate(
        self,
        agreement_id: uuid.UUID,
        period_from: date,
        period_to: date,
    ) -> Decimal:
        """Calculate bonus amount for the given agreement and period."""
        ...
