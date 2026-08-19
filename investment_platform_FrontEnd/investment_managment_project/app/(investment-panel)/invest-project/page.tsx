import { Suspense } from "react";
import InvestProjectsClient from "./InvestProjectsClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <InvestProjectsClient />
    </Suspense>
  );
}