from .base import BasePaymentGateway, PaymentGatewayError, PaymentRequestResult, PaymentVerifyResult
from .sejam import SejamSettlementClient
from .zarinpal import ZarinpalGateway

__all__ = ["get_payment_gateway", "BasePaymentGateway", "PaymentGatewayError", "PaymentRequestResult", "PaymentVerifyResult", "SejamSettlementClient", "ZarinpalGateway"]

_GATEWAYS = {"ZARINPAL": ZarinpalGateway}


def get_payment_gateway(gateway_type: str, merchant_id: str, sandbox: bool) -> BasePaymentGateway:
    cls = _GATEWAYS.get(gateway_type)
    if not cls:
        raise PaymentGatewayError(f"درگاه پرداخت '{gateway_type}' پشتیبانی نمی‌شود.")
    return cls(merchant_id=merchant_id, sandbox=sandbox)