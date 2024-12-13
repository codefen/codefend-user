import { type FC } from 'react';
import { ChartIcon, DocumentTextIcon, ImportantIcon } from '@icons';
import { SimpleSection } from '@defaults/SimpleSection';
import type { CompanyOrders } from '@interfaces/preferences';
import { useQualitySurveyStore } from '@stores/qualitySurvey.store';
import { TableV2 } from '@table/tablev2';
import { defaultOrderColumns } from '@mocks/defaultData';
import type { TableItem } from '@interfaces/table';
import { useQualitySurveyStart } from '@hooks/quality-survey/useQualitySurveyStart';
import useOrderScopeStore from '@stores/orderScope.store';

interface BillingDataProps {
  isLoading: boolean;
  orders: CompanyOrders[];
}

const SettingOrderAndBilling: FC<BillingDataProps> = ({ orders, isLoading }) => {
  const { updateIsOpen, updateOrderId, updateReferenceNumber } = useQualitySurveyStore();
  const { updateOpen, updateScope, updateViewConfirm, updateViewTransfer } = useOrderScopeStore();
  const startPoll = useQualitySurveyStart();

  const handleOpenPoll = (id: string, referenceNumber: string) => {
    updateIsOpen(true);
    updateOrderId(id);
    updateReferenceNumber(referenceNumber);
    startPoll(id, referenceNumber);
  };
  const handleOpenScope = (scope: any) => {
    updateOpen(true);
    updateScope(scope);
    updateViewConfirm(false);
    updateViewTransfer(false);
  };

  const dataTable = orders.map(
    (order: CompanyOrders) =>
      ({
        ID: { value: '', style: 'id' },
        Identifier: { value: Number(order.id), style: 'id' },
        size: { value: order.chosen_plan, style: 'size' },
        offensivness: { value: order.offensiveness, style: 'offensivness' },
        type: { value: order.resources_class, style: 'type' },
        provider: {
          value: `@${order.provider_username}`,
          style: 'username',
        },
        funds: { value: order.funds_full, style: 'funds' },
        state: { value: order.condicion_provider, style: 'state' },
        publishedFinish: {
          value: order?.fecha_cierre_real || '--/--/--',
          style: 'date',
        },
        action: {
          value: (
            <>
              <span
                title={
                  order.condicion_provider === 'finished' && order.condicion_review === 'unreviewed'
                    ? 'Start quality poll'
                    : 'The poll is now completed'
                }
                className={`${order.condicion_provider === 'finished' && order.condicion_review === 'unreviewed' ? 'order-poll-active' : 'order-poll-disabled'}`}
                onClick={() => {
                  if (
                    order.condicion_provider === 'finished' &&
                    order.condicion_review === 'unreviewed'
                  ) {
                    handleOpenPoll(order.id, order.reference_number);
                  }
                }}>
                <ImportantIcon />
              </span>
              <span
                onClick={() => {
                  handleOpenScope(JSON.parse(order.resources_scope.trim() || '{}'));
                }}>
                <DocumentTextIcon />
              </span>
            </>
          ),
          style: 'id action',
        },
      }) as Record<string, TableItem>
  );

  return (
    <>
      <div className="card orders-preference-card">
        <SimpleSection header="ORDERS & BILLING DETAILS" icon={<ChartIcon />}>
          <div className="order-preference-content">
            <TableV2
              columns={defaultOrderColumns}
              rowsData={dataTable}
              showRows={!isLoading}
              showEmpty={!isLoading && !Boolean(orders.length)}
            />
          </div>
        </SimpleSection>
      </div>
    </>
  );
};

export default SettingOrderAndBilling;
