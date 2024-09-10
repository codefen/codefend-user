import { OrderPaymentMethod, useOrderStore } from '../../../../../data';
import { CryptoPaymentModal } from '../payments/CryptoPaymentModal.tsx';
import { BankPaymentModal } from '../payments/BankPaymentModal.tsx';
import { CardPaymentModal } from '../payments/CardPaymentModal.tsx';

export const AnyPaymentMetod = () => {
  const { paymentMethod } = useOrderStore(state => state);

  if (paymentMethod === OrderPaymentMethod.BANK_TRANSFER) return <BankPaymentModal />;
  if (paymentMethod === OrderPaymentMethod.CARD) return <CardPaymentModal />;

  return <CryptoPaymentModal />;
};
