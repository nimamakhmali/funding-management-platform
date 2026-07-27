from shared.exceptions import BusinessRuleViolation, InsufficientBalanceException, NotFoundException

InsufficientBalance = InsufficientBalanceException


class InvestmentNotFound(NotFoundException):
    default_message = "سرمایه‌گذاری یافت نشد."


class InvalidInvestmentState(BusinessRuleViolation):
    default_message = "این عملیات با وضعیت فعلی سرمایه‌گذاری سازگار نیست."


class ProjectNotInvestable(BusinessRuleViolation):
    default_message = "سرمایه‌گذاری فقط روی پروژه‌های تایید شده امکان‌پذیر است."