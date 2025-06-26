import { DocumentTextIcon, ImportantIcon } from '@icons';
import type { CompanyOrders } from '@interfaces/preferences';
import { useQualitySurveyStore } from '@stores/qualitySurvey.store';
import type { ColumnTableV3, TableItem } from '@interfaces/table';
import { useQualitySurveyStart } from '@hooks/quality-survey/useQualitySurveyStart';
import useOrderScopeStore from '@stores/orderScope.store';
import { TABLE_KEYS } from '@/app/constants/app-texts';
import Tablev3 from '@table/v3/Tablev3';
import { naturalTime } from '@utils/helper';

interface BillingDataProps {
  isLoading: boolean;
  orders: CompanyOrders[];
}

const rawOrderColumns: ColumnTableV3[] = [
  {
    header: 'ID',
    key: 'id',
    styles: 'item-cell-preference-1',
    weight: '16.6%',
    render: value => value,
  },
  {
    header: 'Price',
    key: 'chosen_plan_price',
    styles: 'item-cell-preference-2',
    weight: '18.6%',
    render: value => value,
  },
  {
    header: 'Type',
    key: 'resources_class',
    styles: 'item-cell-preference-3',
    weight: '18.6%',
    render: value => value,
  },
  {
    header: 'State',
    key: 'condicion_financial',
    styles: 'item-cell-preference-4',
    weight: '21.6%',
    render: value => value,
  },
  {
    header: 'Closing date',
    key: 'fecha_cierre_real',
    styles: 'item-cell-preference-5',
    weight: '24.6%',
    render: value => (value ? naturalTime(value) : '--/--/--'),
  },
];
const SettingOrderAndBilling = ({ orders, isLoading }: BillingDataProps) => {
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

  const orderMenuOptions = [
    {
      label: 'Start poll',
      disabled: (order: any) =>
        !Boolean(
          order?.condicion_provider === 'finished' && order?.condicion_review === 'unreviewed'
        ),
      icon: <ImportantIcon />,
      onClick: (order: any) => {
        if (order?.condicion_provider === 'finished' && order?.condicion_review === 'unreviewed') {
          handleOpenPoll(order.id, order.reference_number);
        }
      },
    },
    {
      label: 'Open order scope',
      icon: <DocumentTextIcon />,
      onClick: (order: any) => {
        handleOpenScope(JSON.parse(order.resources_scope.trim() || '{}'));
      },
    },
  ];

  return (
    <>
      <div className="card">
        <div className="order-preference-content">
          <Tablev3
            columns={rawOrderColumns}
            rows={orders}
            showRows={!isLoading}
            initialOrder="id"
            limit={0}
            isNeedSort
            enableContextMenu
            contextMenuActions={orderMenuOptions}
          />
        </div>
      </div>
    </>
  );
};

export default SettingOrderAndBilling;
