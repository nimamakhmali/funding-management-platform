import TransactionFilterSection from "@/components/pages/investment-panel/transaction-history/TransactionFilterSection";
import TransactionHistoryHeader from "@/components/pages/investment-panel/transaction-history/TransactionHistoryHeader";
import TransactionTable from "@/components/pages/investment-panel/transaction-history/TransactionTable";
import Container from "@/components/ui/Container";

export default function Page() {
  return (
    <Container>
      <TransactionHistoryHeader />
      <TransactionFilterSection />
      <TransactionTable />
    </Container>
  );
}
