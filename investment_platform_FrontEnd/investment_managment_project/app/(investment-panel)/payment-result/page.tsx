import { PaymentResultBody } from "@/components/pages/investment-panel/payment-result/PaymentResultBody";
import { PaymentResultFooter } from "@/components/pages/investment-panel/payment-result/PaymentResultFooter";
import PaymentResultHeader from "@/components/pages/investment-panel/payment-result/PaymentResultHeader";
import { PaymentResultSection } from "@/components/pages/investment-panel/payment-result/PaymentResultSection";
import Container from "@/components/ui/Container";
import { PaymentResultContainer } from "@/components/pages/investment-panel/payment-result/PaymentResultContainer";
export default function Page(){
  return (
  <Container>
    <PaymentResultHeader />
      <PaymentResultContainer>
      <PaymentResultSection />
      <PaymentResultBody />  
      <PaymentResultFooter />
    </PaymentResultContainer>
 </Container>
  ); 
}