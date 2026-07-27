from dataclasses import dataclass
from decimal import Decimal


@dataclass
class WalletEntity:
    user_id: str
    balance: Decimal
    blocked_amount: Decimal

    @property
    def available_balance(self) -> Decimal:
        return self.balance - self.blocked_amount