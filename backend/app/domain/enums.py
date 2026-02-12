import enum


class AgreementStatus(str, enum.Enum):
    READY_FOR_CALCULATION = "READY_FOR_CALCULATION"
    CALCULATED = "CALCULATED"
    DELETED = "DELETED"


class GridType(str, enum.Enum):
    PERCENT = "PERCENT"
    FIX = "FIX"
