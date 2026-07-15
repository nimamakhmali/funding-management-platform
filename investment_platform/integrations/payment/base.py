"""
Base Payment Client
"""
from abc import ABC, abstractmethod


class BasePaymentClient(ABC):
    @abstractmethod
    def settle_profit(
        self, *, national_code: str, amount: str,
        payout_item_id: str, description: str,
    ) -> dict:
        raise NotImplementedError
