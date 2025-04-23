import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { PrimaryButton } from '@buttons/index';
import { OrderSection } from '@interfaces/order';
import { useOrderStore } from '@stores/orders.store';
import { useEffect, useState } from 'react';

const PLAN_PREFERENCE_MAP = {
  small: {
    type: 'small',
    price: '$1,500',
    promise: 'analisis unico pequeño',
    list: [
      'Maximo recomendado de <b>2 dominios.</b>',
      'Maximo recomendado de <b>6 subdominios.</b>',
      'Valor de los dominios: <b>normal.</b>',
      'Neuroscan: <b>5 scaneos automatizados.</b>',
      'Dataleaks search: <b>10 búsquedas.</b>',
      '<b>40 horas</b> de pentest manual.',
    ],
  },
  medium: {
    type: 'medium',
    price: '$4,500',
    promise: 'analisis unico intermedio',
    list: [
      'Maximo recomendado de <b>5 dominios.</b>',
      'Maximo recomendado de <b>15 subdominios.</b>',
      'Valor de los dominios: <b>normal.</b>',
      'Neuroscan: <b>10 escaneos automatizados.</b>',
      'Dataleaks search: <b>20 busquedas.</b>',
      '<b>120 horas</b> de pentest manual.',
    ],
  },
  advanced: {
    type: 'advanced',
    price: '$13,500',
    promise: 'analisis unico avanzado',
    list: [
      'Maximo recomendado de <b>10 a 15 dominios.</b>',
      'Maximo recomendado de <b>30 subdominios.</b>',
      'Valor de los dominios: <b>elevado.</b>',
      'Neuroscan: <b>60 escaneos automatizados.</b>',
      'Dataleaks search: <b>60 busquedas.</b>',
      '<b>360 horas</b> de pentest manual.',
    ],
  },
};

export const RecommendedPlanOrderModal = () => {
  const { updateState } = useOrderStore(state => state);
  const { planPreference, isDefaultPlan } = useGlobalFastFields([
    'planPreference',
    'isDefaultPlan',
  ]);
  const [plan, setPlan] = useState<any>(PLAN_PREFERENCE_MAP[planPreference.get]);

  useEffect(() => {
    setPlan(PLAN_PREFERENCE_MAP[planPreference.get]);
  }, [planPreference.get]);

  const seeOtherPlans = () => {
    updateState('orderStepActive', OrderSection.ALL_PLANS);
  };

  return (
    <div className="step-new-content">
      <div className="step-new-header">
        <h3>
          Plan {isDefaultPlan.get ? 'recomendado' : 'seleccionado'}: {plan.promise}
        </h3>
        <p>Hemos analizado tus recursos y este es el plan que te recomendamos:</p>
      </div>

      <div className="flex-box">
        <div className="flex-box-column">
          <img
            src={`/codefend/${plan.type}-plan.png`}
            width={90}
            height={90}
            alt="recommended-plan"
          />
          <span className="codefend-text-red title-format">{plan.price}</span>
        </div>
        <ul className="plain-list">
          {plan.list.map((item: string, index: number) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      </div>
      <p>Te parece que esta bien este plan o queres seleccionar otro?</p>

      <div className="button-wrapper next-btns">
        <div className="secondary-container">
          <PrimaryButton
            text="see other plans"
            className="full"
            buttonStyle="black"
            disabledLoader
            click={seeOtherPlans}
          />
        </div>
        <div className="primary-container">
          <PrimaryButton text="Continue" className="full" buttonStyle="red" disabledLoader />
        </div>
      </div>
    </div>
  );
};
