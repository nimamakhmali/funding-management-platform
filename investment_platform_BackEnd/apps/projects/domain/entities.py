from dataclasses import dataclass
from decimal import Decimal


@dataclass
class ProjectEntity:
    id: str
    owner_id: str
    title: str
    required_budget: Decimal
    raised_amount: Decimal
    status: str

    @property
    def funding_percentage(self) -> Decimal:
        return (self.raised_amount / self.required_budget) * 100 if self.required_budget else Decimal("0")

    @property
    def is_funding_complete(self) -> bool:
        return self.raised_amount >= self.required_budget