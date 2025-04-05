import { type FC } from 'react';
import { ChartIcon, DocumentTextIcon, ImportantIcon } from '@icons';
import type { CompanyOrders } from '@interfaces/preferences';
import { useQualitySurveyStore } from '@stores/qualitySurvey.store';
import { TableV2 } from '@table/tablev2';
import { defaultOrderColumns } from '@mocks/defaultData';
import type { ColumnTableV3, TableItem } from '@interfaces/table';
import { useQualitySurveyStart } from '@hooks/quality-survey/useQualitySurveyStart';
import useOrderScopeStore from '@stores/orderScope.store';
import { TABLE_KEYS } from '@/app/constants/app-texts';
import Tablev3 from '@table/v3/Tablev3';
import { SimpleSection } from '@/app/views/components/SimpleSection/SimpleSection';

interface BillingDataProps {
  isLoading: boolean;
  orders: CompanyOrders[];
}

const rawOrderCollumns: ColumnTableV3[] = [
  {
    header: 'ID',
    key: 'id',
    styles: 'item-cell-1 id',
    weight: '9%',
    render: value => value,
  },
  {
    header: 'Size',
    key: 'chosen_plan',
    styles: 'item-cell-2',
    weight: '10%',
    render: value => value,
  },
  {
    header: 'Offensiveness',
    key: 'offensiveness',
    styles: 'item-cell-3',
    weight: '11%',
    render: value => value,
  },
  {
    header: 'Type',
    key: 'resources_class',
    styles: 'item-cell-4',
    weight: '9%',
    render: value => value,
  },
  {
    header: 'Provider',
    key: 'provider_username',
    styles: 'item-cell-5',
    weight: '14%',
    render: value => `@${value}`,
  },
  {
    header: 'Funds',
    key: 'funds_full',
    styles: 'item-cell-6',
    weight: '11%',
    render: value => value,
  },
  {
    header: 'State',
    key: 'condicion_provider',
    styles: 'item-cell-7',
    weight: '11%',
    render: value => value,
  },
  {
    header: 'Published Finish',
    key: 'fecha_cierre_real',
    styles: 'item-cell-8',
    weight: '18%',
    render: value => value || '--/--/--',
  },
];
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

  const orderCollumns = [
    ...rawOrderCollumns,
    {
      header: '',
      key: TABLE_KEYS.ACTION,
      type: TABLE_KEYS.FULL_ROW,
      styles: 'item-cell-9 action',
      weight: '7%',
      render: (order: any) => (
        <div className="publish" key={`actr-${order.id}`}>
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
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="card">
        <SimpleSection header="ORDERS & BILLING DETAILS" icon={<ChartIcon />}>
          <div className="order-preference-content">
            <Tablev3
              columns={orderCollumns}
              rows={orders}
              showRows={!isLoading}
              initialOrder="id"
              limit={0}
              isNeedSort
            />
          </div>
        </SimpleSection>
      </div>
    </>
  );
};

export default SettingOrderAndBilling;
