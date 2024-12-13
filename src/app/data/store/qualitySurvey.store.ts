import { QualitySurveyPhase, type PollValues } from '@interfaces/quality-feedback';
import { EMPTY_PROVIDER } from '@/app/constants/empty';
import { create } from 'zustand';

export interface ProviderProfileStore {
  isOpen: boolean;
  isFinishQualityPoll: boolean;
  activePhase: QualitySurveyPhase;
  orderId: string;
  referenceNumber: string;
  pollVal: PollValues;

  message: string;
  provider: any;
  updatePhase: (phase: QualitySurveyPhase) => void;
  updatePollVal: (val: PollValues) => void;

  updateMessage: (message: string) => void;
  updateIsOpen: (isOpen: boolean) => void;
  updateProvider: (provider: any) => void;
  updateOrderId: (orderId: string) => void;
  updateReferenceNumber: (referenceNumber: string) => void;
  updateIsFinishQualityPoll: (isFinishQualityPoll: boolean) => void;
}

export const useQualitySurveyStore = create<ProviderProfileStore>((set, _get) => ({
  isOpen: false,
  isFinishQualityPoll: false,
  activePhase: QualitySurveyPhase.INIT,
  referenceNumber: '',
  orderId: '',
  pollVal: '3' as '3',
  message: '',
  provider: EMPTY_PROVIDER,
  updatePhase: (phase: QualitySurveyPhase) => set({ activePhase: phase }),
  updatePollVal: (val: PollValues) => set({ pollVal: val }),

  updateMessage: (message: string) => set({ message: message }),
  updateIsOpen: (isOpen: boolean) => set({ isOpen: isOpen }),
  updateProvider: (provider: any) => set({ provider: provider }),
  updateOrderId: (orderId: string) => set({ orderId: orderId }),
  updateReferenceNumber: (referenceNumber: string) => set({ referenceNumber: referenceNumber }),
  updateIsFinishQualityPoll: (isFinishQualityPoll: boolean) =>
    set({ isFinishQualityPoll: isFinishQualityPoll }),
}));
