# Project value objects
from dataclasses import dataclass
from decimal import Decimal
from shared.exceptions import ValidationException


@dataclass(frozen=True)
class FundingRange:
    min_amount: Decimal
    required_budget: Decimal

    def __post_init__(self):
        if self.min_amount <= 0:
            raise ValidationException("حداقل مبلغ سرمایه‌گذاری باید مثبت باشد.")
        if self.required_budget <= 0:
            raise ValidationException("بودجه مورد نیاز طرح باید مثبت باشد.")
        if self.min_amount > self.required_budget:
            raise ValidationException("حداقل سرمایه‌گذاری نمی‌تواند از کل بودجه طرح بیشتر باشد.")