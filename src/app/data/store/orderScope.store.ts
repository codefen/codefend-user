import { useLocation } from 'react-router';
import { create } from 'zustand';

interface IState {
	open: boolean;
    scope: any;
    viewConfirm: boolean; 
    onConfirm: ()=>void;

    updateOpen: (open: boolean)=>void;
    updateScope: (scope: any)=>void;
    updateViewConfirm: (viewConfirm: boolean)=>void;
    updateOnConfirm: (onConfirm: ()=>void)=>void;
}

const useOrderScopeStore = create<IState>((set) => ({
	open: false, 
    scope: {},
    viewConfirm: false,
    onConfirm: ()=>{},

    updateOpen: (open: boolean)=>set((state) => ({ open })),
    updateScope: (scope: any)=>set((state) => ({ scope })),
    updateViewConfirm: (viewConfirm: boolean)=>set((state) => ({ viewConfirm })),
    updateOnConfirm: (onConfirm: ()=>void)=>set((state) => ({ onConfirm })),
}));

export default useOrderScopeStore;