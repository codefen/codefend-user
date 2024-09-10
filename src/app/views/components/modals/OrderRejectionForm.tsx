import { useProviderRefuseOrder } from '@userHooks/providers/useProviderRefuseOrder';
import { useState, type FC } from 'react';
import { ModalButtons, PencilIcon } from '..';
import { useProviderRefuseStore } from '@stores/providerOrder.store';

export const OrderRejectionForm = () => {
  const { setIsRefusing, setRefuseState, allClose, orderId } = useProviderRefuseStore();
  const { refuseOrder, isRefusing } = useProviderRefuseOrder();
  const [reason, setReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('');

  const handleReasonChange = (event: any) => {
    setReason(event.target.value);
  };

  const handleSelectedReasonChange = (event: any) => {
    setSelectedReason(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    refuseOrder(selectedReason, reason, orderId).then(() => {
      setRefuseState(2);
      setIsRefusing(false);
      allClose();
    });
  };
  return (
    <div className="content refuse">
      <h2>You can tell us why you want to reject the order</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-input">
          <label className={`first-label ${selectedReason === 'personal' && 'is-active'}`}>
            <input
              id="selected-reason-personal"
              className="radio-option"
              type="radio"
              value="personal"
              name="selectedReason"
              defaultChecked={selectedReason === 'personal'}
              onChange={handleSelectedReasonChange}
              required
            />
            <div className="codefend-radio"></div>
            Personal motives
          </label>
        </div>
        <div className="form-input">
          <label className={`second-label ${selectedReason === 'financial' && 'is-active'}`}>
            <input
              id="selected-reason-financial"
              className="radio-option"
              name="selectedReason"
              type="radio"
              value="financial"
              defaultChecked={selectedReason === 'financial'}
              onChange={handleSelectedReasonChange}
              required
            />
            <div className="codefend-radio"></div>
            Financial reasons
          </label>
        </div>
        <div className="form-input">
          <span className="pencil-icon need-m">
            <PencilIcon />
          </span>
          <textarea
            value={reason}
            maxLength={256}
            onChange={handleReasonChange}
            placeholder="Optional: Brief description of the reason"
            className="text-area-input log-inputs2 text-area"
          />
        </div>

        <ModalButtons
          closeText="Cancel"
          confirmText="Send"
          close={allClose}
          isDisabled={isRefusing}
        />
      </form>
    </div>
  );
};
