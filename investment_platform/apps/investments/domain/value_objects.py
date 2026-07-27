from dataclasses import dataclass
from decimal import Decimal

from shared.exceptions import ValidationException


@dataclass(frozen=True)
class Money:
    amount: Decimal

    def __post_init__(self):
        if self.amount <= 0:
            raise ValidationException("مبلغ باید بزرگ‌تر از صفر باشد.")