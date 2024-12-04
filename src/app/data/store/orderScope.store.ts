import { create } from 'zustand';

interface IState {
  open: boolean;
  scope: any;
  viewConfirm: boolean;
  viewTransfer: boolean;
  orderId: string;
  onConfirm: (notConfirm?: boolean) => void;

  updateOrderId: (ID: string) => void;
  updateOpen: (open: boolean) => void;
  updateScope: (scope: any) => void;
  updateViewConfirm: (viewConfirm: boolean) => void;
  updateOnConfirm: (onConfirm: (notConfirm?: boolean) => void) => void;
  updateViewTransfer: (viewTransfer: boolean) => void;
}

const useOrderScopeStore = create<IState>(set => ({
  open: false,
  scope: {},
  viewConfirm: false,
  viewTransfer: false,
  orderId: '',
  onConfirm: () => {},

  updateOrderId: (id: string) => set(state => ({ ...state, orderId: id })),
  updateOpen: (open: boolean) => set(state => ({ open })),
  updateScope: (scope: any) => set(state => ({ scope })),
  updateViewConfirm: (viewConfirm: boolean) => set(state => ({ viewConfirm })),
  updateOnConfirm: (onConfirm: (notConfirm?: boolean) => void) => set(state => ({ onConfirm })),
  updateViewTransfer: viewTransfer => set(state => ({ ...state, viewTransfer: viewTransfer })),
}));

export default useOrderScopeStore;
