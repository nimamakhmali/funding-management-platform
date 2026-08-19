import { MoveDownLeft, MoveUpRight } from "lucide-react";
import { ReactNode } from "react";

type Props = { transactionType: "deposit" | "withdrawal" };

export default function TransactionType({ transactionType }: Props) {
  let transactionTypeComponent: ReactNode;
  switch (transactionType) {
    case "deposit":
      transactionTypeComponent = (
        <>
          <span className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <MoveDownLeft />
          </span>
          <span className="text-sm font-medium text-text-main">واریز وجه</span>
        </>
      );
      break;
    case "withdrawal":
      transactionTypeComponent = (
        <>
          <span className="size-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <MoveUpRight />
          </span>

          <span className="text-sm font-medium text-text-main">واریز وجه</span>
        </>
      );
      break;
    default:
      throw new Error("Invalid transaction type");
  }

  return (
    <div className="flex items-center gap-3">{transactionTypeComponent}</div>
  );
}
