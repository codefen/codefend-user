import { DocumentTextIcon, ImportantIcon } from '@icons';
import type { CompanyOrders } from '@interfaces/preferences';
import { useQualitySurveyStore } from '@stores/qualitySurvey.store';
import type { ColumnTableV3, TableItem } from '@interfaces/table';
import { useQualitySurveyStart } from '@hooks/quality-survey/useQualitySurveyStart';
import useOrderScopeStore from '@stores/orderScope.store';
import { MODAL_KEY_OPEN, TABLE_KEYS } from '@/app/constants/app-texts';
import Tablev3 from '@table/v3/Tablev3';
import { naturalTime } from '@utils/helper';
import { SimpleSection } from '@/app/views/components/SimpleSection/SimpleSection';
import { useSubscriptionActions } from '@hooks/orders/useSubscriptionActions';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';
import useModalStore from '@stores/modal.store';

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
  const { upgradePlan } = useSubscriptionActions();
  const { setIsOpen, setModalId } = useModalStore();
  const subscriptionSelected = useGlobalFastField('subscriptionSelected');

  // Filter orders into two groups based on chosen_plan_price
  const subscriptionOrders = orders.filter(
    order => Number(order.chosen_plan_price) < 1000 && !order?.resources_class
  );
  const premiumOrders = orders.filter(
    order => Number(order.chosen_plan_price) >= 1000 && !!order?.resources_class
  );

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
  const suscriptionActions = [
    {
      label: 'Cancel subscription',
      icon: <DocumentTextIcon />,
      onClick: (order: any) => {
        setIsOpen(true);
        setModalId(MODAL_KEY_OPEN.CANCEL_SUBSCRIPTION);
        subscriptionSelected.set(order);
      },
    },
    {
      label: 'Upgrade plan',
      icon: <ImportantIcon />,
      onClick: (order: any) => {
        upgradePlan(order);
      },
    },
  ];

  // Check if both order types are empty (no orders at all)
  const hasNoOrders = premiumOrders.length === 0 && subscriptionOrders.length === 0;

  // If no orders exist, show a single card with a message
  if (hasNoOrders && !isLoading) {
    return (
      <div className="card">
        <SimpleSection header="Orders and Payments">
          <div className="no-data-container">
            <div className="no-data-content">
              <div className="no-data-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                  <line x1="9" y1="9" x2="9.01" y2="9"/>
                  <line x1="15" y1="9" x2="15.01" y2="9"/>
                </svg>
              </div>
              <h3>You have no orders!</h3>
              <p>
                If you just placed an order please allow our team to work for a few 
                hours before getting the first results.
              </p>
            </div>
          </div>
        </SimpleSection>
      </div>
    );
  }

  // If there are orders or still loading, show the normal two-card layout
  return (
    <>
      <div className="card">
        <SimpleSection header="Professional Hackers On Demand Orders">
          <Tablev3
            columns={rawOrderColumns}
            rows={premiumOrders}
            showRows={true}
            showSkeleton={isLoading}
            totalRowCount={5}
            initialOrder="id"
            limit={0}
            isNeedSort
            enableContextMenu
            contextMenuActions={orderMenuOptions}
          />
        </SimpleSection>
      </div>

      <div className="card">
        <SimpleSection header="AI Surveillance Orders">
          <Tablev3
            columns={rawOrderColumns}
            rows={subscriptionOrders}
            showRows={true}
            showSkeleton={isLoading}
            totalRowCount={5}
            initialOrder="id"
            limit={0}
            isNeedSort
            enableContextMenu
            contextMenuActions={suscriptionActions}
          />
        </SimpleSection>
      </div>
    </>
  );
};

export default SettingOrderAndBilling;
