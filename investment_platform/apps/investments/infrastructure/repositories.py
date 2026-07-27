from .models import Investment, Transaction, Wallet


class WalletRepository:
    def get_or_create(self, user) -> Wallet:
        wallet, _ = Wallet.objects.get_or_create(user=user)
        return wallet

    def for_update(self, user) -> Wallet:
        return Wallet.objects.select_for_update().get(user=user)


class InvestmentRepository:
    def for_update(self, investment_id) -> Investment:
        return Investment.objects.select_for_update().select_related("investor", "project").get(pk=investment_id)

    def get_transaction_for_investment(self, investment, tx_type) -> Transaction | None:
        return (Transaction.objects.select_for_update()
                .filter(investment=investment, type=tx_type).order_by("-created_at").first())