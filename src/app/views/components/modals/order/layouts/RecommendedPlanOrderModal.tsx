import { AppConstants } from '@/app/constants/app-contanst';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { PrimaryButton } from '@buttons/index';
import { useOrderPlan } from '@hooks/index';
import { OrderSection, ResourcesTypes } from '@interfaces/order';
import { useOrderStore } from '@stores/orders.store';
import { useEffect, useState } from 'react';

export const RecommendedPlanOrderModal = () => {
  const { updateState, referenceNumber, orderId, resourceType } = useOrderStore(state => state);
  const { planPreference, isDefaultPlan } = useGlobalFastFields([
    'planPreference',
    'isDefaultPlan',
  ]);
  const [plan, setPlan] = useState<any>(
    AppConstants.PLAN_PREFERENCE_MAP[resourceType][planPreference.get]
  );
  const { sendPlanTeamSize } = useOrderPlan();
  //const { teamSize, updateState, referenceNumber, orderId } = useOrderStore(state => state);

  useEffect(() => {
    const resourcePlan = AppConstants.PLAN_PREFERENCE_MAP[resourceType];
    setPlan(resourcePlan[planPreference.get]);
  }, [planPreference.get]);

  const seeOtherPlans = () => {
    updateState('orderStepActive', OrderSection.ALL_PLANS);
  };

  const continueWithPlan = () => {
    const selectedPlan = planPreference.get === 'advanced' ? 'full' : planPreference.get;
    updateState('orderStepActive', OrderSection.ENVIRONMENT);
    sendPlanTeamSize(selectedPlan, plan.price, referenceNumber, orderId);
  };

  return (
    <div className="step-new-content">
      <div className="step-new-header">
        <h3>
          {isDefaultPlan.get ? 'Recommended plan' : 'Selected plan'}:{' '}
          {plan.promise === 'analisis unico avanzado'
            ? 'advanced one-time analysis'
            : plan.promise === 'analisis unico intermedio'
              ? 'intermediate one-time analysis'
              : plan.promise === 'analisis unico pequeño'
                ? 'basic one-time analysis'
                : plan.promise}
        </h3>
        <p>We have analyzed your resources and this is the plan we recommend:</p>
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
            <li
              key={index}
              dangerouslySetInnerHTML={{
                __html: item
                  .replace(
                    'Maximo recomendado de <b>2 dominios.</b>',
                    'Maximum recommended: <b>2 domains.</b>'
                  )
                  .replace(
                    'Maximo recomendado de <b>6 subdominios.</b>',
                    'Maximum recommended: <b>6 subdomains.</b>'
                  )
                  .replace('Valor de los dominios: <b>normal.</b>', 'Domain value: <b>normal.</b>')
                  .replace(
                    'Neuroscan: <b>5 scaneos automatizados.</b>',
                    'Neuroscan: <b>5 automated scans.</b>'
                  )
                  .replace(
                    'Dataleaks search: <b>10 búsquedas.</b>',
                    'Dataleaks search: <b>10 searches.</b>'
                  )
                  .replace(
                    '<b>40 horas</b> de pentest manual.',
                    '<b>40 hours</b> of manual pentest.'
                  )
                  .replace(
                    'Maximo recomendado de <b>10 a 15 dominios.</b>',
                    'Maximum recommended: <b>10 to 15 domains.</b>'
                  )
                  .replace(
                    'Maximo recomendado de <b>30 subdominios.</b>',
                    'Maximum recommended: <b>30 subdomains.</b>'
                  )
                  .replace('Valor de los dominios: <b>elevado.</b>', 'Domain value: <b>high.</b>')
                  .replace(
                    'Neuroscan: <b>60 escaneos automatizados.</b>',
                    'Neuroscan: <b>60 automated scans.</b>'
                  )
                  .replace(
                    'Dataleaks search: <b>60 busquedas.</b>',
                    'Dataleaks search: <b>60 searches.</b>'
                  )
                  .replace(
                    '<b>360 horas</b> de pentest manual.',
                    '<b>360 hours</b> of manual pentest.'
                  )
                  .replace(
                    'Maximo recomendado de <b>5 dominios.</b>',
                    'Maximum recommended: <b>5 domains.</b>'
                  )
                  .replace(
                    'Maximo recomendado de <b>15 subdominios.</b>',
                    'Maximum recommended: <b>15 subdomains.</b>'
                  )
                  .replace(
                    'Neuroscan: <b>10 escaneos automatizados.</b>',
                    'Neuroscan: <b>10 automated scans.</b>'
                  )
                  .replace(
                    'Dataleaks search: <b>20 busquedas.</b>',
                    'Dataleaks search: <b>20 searches.</b>'
                  )
                  .replace(
                    '<b>120 horas</b> de pentest manual.',
                    '<b>120 hours</b> of manual pentest.'
                  ),
              }}
            />
          ))}
        </ul>
      </div>
      <p>Do you think this plan is right for you or do you want to select another one?</p>

      <div className="button-wrapper next-btns">
        <div className="secondary-container">
          <PrimaryButton
            text="See other plans"
            className="full"
            buttonStyle="black"
            disabledLoader
            click={seeOtherPlans}
          />
        </div>
        <div className="primary-container">
          <PrimaryButton
            text="Continue"
            click={continueWithPlan}
            className="full"
            buttonStyle="red"
            disabledLoader
          />
        </div>
      </div>
    </div>
  );
};
