import { PrimaryButton } from '@buttons/index';

export const OrdersAndPaymentHeaderPage = () => (
  <div className="card rectangle">
    <div className="over">
      <img
        src="/codefend/coin-payments.png"
        alt="orders-payments"
        width={200}
        height={200}
        decoding="async"
      />
      <div className="header-content">
        <h2>Orders and payments</h2>
        <p>View and manage your purchase orders. Buy new plans for your company.</p>
        <PrimaryButton text="Make a new purchase" buttonStyle="red" />
      </div>
    </div>
  </div>
);
