from dataclasses import dataclass
from decimal import Decimal


@dataclass
class CreateInvestmentDTO:
    project_id: str
    amount: Decimal


@dataclass
class ConfirmPaymentDTO:
    is_successful: bool
    reference_id: str = ""