import { useGlobalFastField, useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { PrimaryButton } from '@buttons/index';
import { OrderSection } from '@interfaces/order';
import { useOrderStore } from '@stores/orders.store';

export const AllPlansOrderModal = () => {
  const store = useGlobalFastFields(['planPreference', 'isDefaultPlan']);
  const { updateState } = useOrderStore(state => state);

  const changed = (type: 'small' | 'medium' | 'advanced') => {
    store.planPreference.set(type);
    store.isDefaultPlan.set(false);
  };

  const closeModal = () => {
    updateState('orderStepActive', OrderSection.PAYWALL);
    updateState('open', false);
  };

  const goToSelectPlan = () => {
    updateState('orderStepActive', OrderSection.RECOMMENDED_PLAN);
  };

  return (
    <div className="step-new-content">
      <div className="step-new-header">
        <h3>Professional hackers & Pentest on demand</h3>
        <p>
          Planes pequeños exclusivos para aplicaciones web ofrecen una combinacion unica de{' '}
          <b>scanners automaticos, asistencia tecnica</b> especializada y{' '}
          <b>busqueda de dataleaks.</b> Todos brindan acceso limitado a la plataforma con creacion
          de informes y visualizacion de issues.
        </p>
      </div>

      <div className="plans-container">
        <label className="plan-card" data-plan="small" htmlFor="plan-1-small">
          <input
            type="radio"
            name="plan"
            id="plan-1-small"
            defaultChecked={store.planPreference.get === 'small'}
            onChange={() => changed('small')}
          />
          <img src={'/codefend/small-plan.png'} width={70} height={70} alt="recommended-plan" />
          <h4>Basic pentest on demand</h4>
          <p>
            Recommended for small sized businesses. Máximo recomendado de 2 dominios. Máximo
            recomendado de 6 subdominios. Valor de los dominios: normal. Neuroscan: 5 scaneos
            automatizados. Dataleaks search: 10 búsquedas. 40 horas de pentest manual.
          </p>
        </label>

        <label className="plan-card" data-plan="medium" htmlFor="plan-2-medium">
          <input
            type="radio"
            name="plan"
            id="plan-2-medium"
            defaultChecked={store.planPreference.get === 'medium'}
            onChange={() => changed('medium')}
          />
          <img src={'/codefend/medium-plan.png'} width={70} height={70} alt="recommended-plan" />
          <h4>Medium pentest on demand</h4>
          <p>
            Medium pentest on demand Recommended for mid sized businesses. Máximo recomendado de 5
            dominios. Máximo recomendado de 15 subdominios. Valor de los dominios: normal.
            Neuroscan:15 scaneos automatizados. Dataleaks search: 30 búsquedas. 120 horas de pentest
            manual.
          </p>
        </label>

        <label className="plan-card" data-plan="advanced" htmlFor="plan-3-advanced">
          <input
            type="radio"
            name="plan"
            id="plan-3-advanced"
            defaultChecked={store.planPreference.get === 'advanced'}
            onChange={() => changed('advanced')}
          />
          <img
            className="smoth"
            src={'/codefend/advanced-plan.png'}
            width={70}
            height={70}
            alt="recommended-plan"
          />
          <h4>Advanced pentest on demand</h4>
          <p>
            Recommended for stablished businesses. Máximo recomendado de 10 a 15 dominios. Máximo
            recomendado de 30 subdominios. Valor de los dominios: elevado. Neuroscan: 60 scaneos
            automatizados. Dataleaks search: 60 búsquedas. 360 horas de pentest manual.
          </p>
        </label>
      </div>

      <div className="button-wrapper next-btns">
        <div className="secondary-container">
          <PrimaryButton
            text="close assistant"
            className="full"
            buttonStyle="black"
            disabledLoader
            click={closeModal}
          />
        </div>
        <div className="primary-container">
          <PrimaryButton
            text="proceed"
            className="full"
            buttonStyle="red"
            disabledLoader
            click={goToSelectPlan}
          />
        </div>
      </div>
    </div>
  );
};
