import { OrderPaymentMethod } from '@interfaces/order.ts';
import { useOrderStore } from '@stores/orders.store.ts';
import { CryptoPaymentModal } from '../payments/CryptoPaymentModal.tsx';
import { BankPaymentModal } from '../payments/BankPaymentModal.tsx';
import { CardPaymentModal } from '../payments/CardPaymentModal.tsx';

export const AnyPaymentMethod = ({
  setCallback,
}: {
  setCallback: (callback: (() => void) | null) => void;
}) => {
  const { paymentMethod } = useOrderStore(state => state);

  if (paymentMethod === OrderPaymentMethod.BANK_TRANSFER) return <BankPaymentModal />;
  if (paymentMethod === OrderPaymentMethod.CARD)
    return <CardPaymentModal setCallback={setCallback} />;

  return <CryptoPaymentModal />;
};
