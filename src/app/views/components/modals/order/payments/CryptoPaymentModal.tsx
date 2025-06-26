import { Fragment, useEffect } from 'react';
import { formatWalletID } from '@utils/helper';
import { OrderSection, OrderTeamSize, CryptoPayment } from '@interfaces/order';
import { useOrderSaveCryptoPayment, useOrderCryptoFinancial } from '@hooks/orders/useOrders';
import { useOrderStore } from '@stores/orders.store';
import { CopiedIcon, CopyIcon } from '@icons';
import { PrimaryButton } from '@buttons/primary/PrimaryButton';

export const CryptoPaymentModal = () => {
  const { teamSize, updateState, referenceNumber, orderId } = useOrderStore(state => state);

  const { getCryptoFinancialInfo, walletActive, qrCode } = useOrderCryptoFinancial();
  const {
    copied,
    trySend,
    transactionID,
    setTrySend,
    setTransactionID,
    copyTextToClipboard,
    saveCryptoPayment,
  } = useOrderSaveCryptoPayment();

  useEffect(() => {
    getCryptoFinancialInfo(referenceNumber, undefined, orderId);
  }, []);

  const finalPrice = () => {
    if (teamSize === OrderTeamSize.SMALL) return '$1,500';
    if (teamSize === OrderTeamSize.MID) return '$4,500';
    return '$13,500';
  };

  const backStep = () => {
    updateState('orderStepActive', OrderSection.PAYMENT);
  };

  const finishStep = () => {
    if (transactionID) {
      saveCryptoPayment(
        referenceNumber,
        walletActive.currencyActive,
        walletActive.walletID,
        orderId
      ).then(() => {
        updateState('orderStepActive', OrderSection.WAIT_CHECK);
      });
    } else {
      setTrySend(true);
      setTimeout(() => setTrySend(false), 2000);
    }
  };

  const values = {
    [CryptoPayment.BITCOIN.valueOf()]: CryptoPayment.BITCOIN,
    [CryptoPayment.ETHERIUM.valueOf()]: CryptoPayment.ETHERIUM,
    [CryptoPayment.LITECOIN.valueOf()]: CryptoPayment.LITECOIN,
    [CryptoPayment.MONERO.valueOf()]: CryptoPayment.MONERO,
    [CryptoPayment.SOLANA.valueOf()]: CryptoPayment.SOLANA,
    [CryptoPayment.USDC.valueOf()]: CryptoPayment.USDC,
    [CryptoPayment.USDT.valueOf()]: CryptoPayment.USDT,
  };
  const qrCodeActive = qrCode.current
    ? `data:image/png;base64, ${qrCode.current}`
    : '/codefend/QR.svg';
  return (
    <div className="step-content">
      <div className="step-header">
        <h3>Select your desired cryptocurrency:</h3>
      </div>
      <div className="step-content crypto-payment">
        <div className="order-img-wrapper show-both-borders ">
          <div className="order-img">
            {Object.values(CryptoPayment).map((coin, i) => (
              <Fragment key={`cc-${i}`}>
                {coin === 'USDT' && <div className="crypto-usd-dash"></div>}
                <img
                  key={i}
                  src={`/codefend/${coin.toLowerCase()}.svg`}
                  alt={coin.toLowerCase()}
                  className={`${walletActive.currencyActive.valueOf() === coin && 'selected-crypto'}`}
                  onClick={() => {
                    getCryptoFinancialInfo(referenceNumber, values[coin], orderId);
                  }}
                />
              </Fragment>
            ))}
          </div>
        </div>
        <div className="payment-details">
          <div className="qrcode">
            <img
              src={qrCodeActive}
              alt="qrcode-icon"
              style={{ filter: 'drop-shadow(0 0 18px #00000073)' }}
              className={`qr-img ${!qrCode.current && 'blur-overlay'}`}
              decoding="async"
              loading="eager"
            />
          </div>
          <div className="details space">
            <div className="top">
              <p className="crypto-payment">
                <span className="codefend-text-red">.</span>
              </p>
            </div>

            <div className="address-container select-option">
              <span className="address-text">
                {walletActive.walletID !== '. . .'
                  ? formatWalletID(walletActive.walletID)
                  : walletActive.walletID}
              </span>

              <div
                className={`copy-icon order-pointer ${copied && 'copied'}`}
                onClick={() => copyTextToClipboard(walletActive.walletID)}>
                {copied ? (
                  <CopiedIcon width={1.25} height={1.25} />
                ) : (
                  <CopyIcon width={1.25} height={1.25} isButton />
                )}
              </div>
            </div>

            <input
              type="text"
              placeholder="Please complete with the transaction ID"
              id="crypto-transaction-id"
              onChange={(e: any) => setTransactionID(e.target.value)}
            />
            {trySend && (
              <span className="error-input vibrate">You must write the id of the transaction</span>
            )}
          </div>
        </div>

        <div className="total-payment show-both-borders">
          <span>Total to be paid in USD</span>
          <span>{finalPrice()}</span>
        </div>
      </div>

      <div className="button-wrapper next-btns">
        <div className="secondary-container">
          <PrimaryButton
            text="back"
            click={backStep}
            className="full"
            buttonStyle="black"
            disabledLoader
          />
        </div>
        <div className="primary-container">
          <PrimaryButton
            text="Verify transaction"
            click={finishStep}
            className="full"
            buttonStyle="red"
            isDisabled={transactionID.trim() === ''}
            disabledLoader
          />
        </div>
      </div>
    </div>
  );
};
