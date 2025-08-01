import { type FC, useState } from 'react';
import { useOrderScope } from '@hooks/orders/useOrders';
import { ScopeOption, OrderSection } from '@interfaces/order';
import { useOrderStore } from '@stores/orders.store';
import useTimeout from '#commonHooks/useTimeout.ts';
import { PrimaryButton } from '@buttons/primary/PrimaryButton.tsx';

export const ScopeOrderModal: FC = () => {
  const { scope, resourceType, resetActiveOrder, updateState, acceptCondition } = useOrderStore(
    state => state
  );
  const [acceptConditions, setAcceptCondition] = useState<boolean>(acceptCondition);
  const [tryClick, setTryClick] = useState<boolean>(false);
  const { sendScopeOrders } = useOrderScope();
  const { oneExecute } = useTimeout(() => setTryClick(false), 2600);
  const nextStep = () => {
    if (acceptConditions) {
      updateState('acceptCondition', acceptConditions);
      sendScopeOrders(resourceType).then((res: any) => {
        updateState('referenceNumber', res?.order.reference_number);
      });
      updateState('orderStepActive', OrderSection.FREQUENCY);
    } else if (!acceptConditions) {
      setTryClick(true);
      oneExecute();
    }
  };

  const ErrorMessage = () => {
    return null;
  };

  return (
    <>
      <div className="step-header">
        <h3>Start a new pentest! Please select the assets that you would like to scope:</h3>
      </div>
      <div className="step-content">
        <div className={`option`}>
          {/*          <input
            id="scope-resources"
            name="scopeOption"
            type="radio"
            className="radio-option"
            checked={scopeOptionW === ScopeOption.TYPE}
            onChange={() => {}}
          /> 
           <div className="codefend-radio"></div>
          */}

          <label htmlFor="scope-resources" className="order-snapshot">
            <div className="top">
              <p>
                {' '}
                Analyze all {resourceType.valueOf()} resources
                <span
                  className={`alt-color order-dash-space ${scope.totalResources === 0 ? 'blur-while-load' : ''} `}>
                  - {scope.totalResources} resources:
                </span>
              </p>
            </div>
            <span className="one-pentest">
              Our experts will focus solely on assessing the security of your{' '}
              {resourceType.valueOf()}-based assets.
            </span>
          </label>
        </div>
        {/*        <div
          className={`option ${scopeOptionW === ScopeOption.ALL && 'select-option'}`}
          onClick={() => setScopeOptionW(ScopeOption.ALL)}>
          <input
            id="all-scope-resources"
            name="scopeOption"
            type="radio"
            className="radio-option"
            checked={scopeOptionW === ScopeOption.ALL}
            onChange={() => {}}
          />
          <div className="codefend-radio"></div>
          <label htmlFor="all-scope-resources" className="order-snapshot">
            <div className="top">
              <p>
                {' '}
                Analyze all company resources{' '}
                <span
                  className={`alt-color order-dash-space ${scope.totalAllResources === -1 ? ' blur-while-load' : ''}`}>
                  {' '}
                  - {scope.totalAllResources} resources
                </span>
              </p>
            </div>
            <span className="one-pentest">
              A holistic assessment of all your company's resources.
            </span>
          </label>
        </div> */}
      </div>
      <div className="scope-confirm">
        <input
          id="confirmation"
          type="checkbox"
          alt="checkbox"
          className="codefend-checkbox confirm-check"
          defaultChecked={acceptConditions}
          onChange={() => setAcceptCondition(!acceptConditions)}
        />
        <label htmlFor="confirmation" className="confirm-label">
          <span 
            className={`disclaimers ${tryClick && !acceptConditions ? 'error' : ''}`}
            title="Open disclaimers"
          >
            I have authorization and I accept the terms and conditions{tryClick && !acceptConditions ? ' ⚠️' : ''}
          </span>
        </label>
        <ErrorMessage />
      </div>

      <div className="button-wrapper next-btns">
        <div className="secondary-container">
          <PrimaryButton
            text="Cancel"
            click={resetActiveOrder}
            className="full"
            buttonStyle="black"
            disabledLoader
          />
        </div>
        <div className="primary-container">
          <PrimaryButton
            text="Next step"
            click={nextStep}
            className="full"
            buttonStyle="red"
            disabledLoader
          />
        </div>
      </div>
    </>
  );
};
