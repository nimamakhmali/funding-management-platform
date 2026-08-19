from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal


@dataclass
class CreateProjectDTO:
    title: str
    description: str
    category: str
    required_budget: Decimal
    min_investment_amount: Decimal
    start_date: datetime
    end_date: datetime
    profit_rate_percentage: Decimal | None = None


@dataclass
class ChangeProjectStatusDTO:
    to_status: str
    reason: str = ""