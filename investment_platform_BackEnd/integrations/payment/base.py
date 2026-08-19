from abc import ABC, abstractmethod
from dataclasses import dataclass

from shared.exceptions import ExternalServiceError


class PaymentGatewayError(ExternalServiceError):
    default_message = "ارتباط با درگاه پرداخت با خطا مواجه شد."


@dataclass
class PaymentRequestResult:
    authority: str
    payment_url: str


@dataclass
class PaymentVerifyResult:
    ref_id: str
    card_pan: str | None = None
    already_verified: bool = False


class BasePaymentGateway(ABC):
    gateway_name: str = "base"

    @abstractmethod
    def request_payment(self, *, amount: int, description: str, callback_url: str, mobile: str = "") -> PaymentRequestResult: ...

    @abstractmethod
    def verify_payment(self, *, amount: int, authority: str) -> PaymentVerifyResult: ...