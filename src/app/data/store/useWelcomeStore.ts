import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { StateInitializer } from '@interfaces/store';
import { ScanStepType } from '@/app/constants/welcome-steps';

export interface WelcomeStore {
  initialDomain: string;
  domainId: string;
  isFirstClose: boolean;
  scanStep: ScanStepType;
  isScanRunning: boolean;
  neuroScanId: string;
  issuesViewed: number;
  issueScanFound: 0;
  issuesParsed: 0;
  setIssuesParsed: (issuesParsed: number) => void;
  setIssueFound: (issueScanFound: number) => void;
  setIssuesViewed: (issuesViewed: number) => void;
  setDomainId: (initialDomain: string) => void;
  saveInitialDomain: (initialDomain: string) => void;
  setFirstClose: (isFirstClose: boolean) => void;
  setScanRunning: (isScanRunning: boolean) => void;
  setScanStep: (scanStep: ScanStepType) => void;
  setNeuroScanId: (neuroScanId: string) => void;
}

const stateInitV2: StateInitializer<WelcomeStore> = (store, persistence) =>
  devtools(persist(store, persistence));

export const useWelcomeStore = create<WelcomeStore>()(
  stateInitV2(
    (set: any, _get: any) => ({
      initialDomain: '',
      isFirstClose: true,
      scanStep: ScanStepType.NonScan,
      isScanRunning: false,
      domainId: '',
      neuroScanId: '',
      issuesViewed: 0,
      issueScanFound: 0,
      issuesParsed: 0,
      setIssuesParsed: (issuesParsed: number) => set({ issuesParsed }),
      setIssuesViewed: issuesViewed => set({ issuesViewed }),
      setIssueFound: issueScanFound => set({ issueScanFound }),
      saveInitialDomain: (initialDomain: string) => set({ initialDomain }),
      setDomainId: (domainId: string) => set({ domainId }),
      setFirstClose: (isFirstClose: boolean) => set({ isFirstClose }),
      setScanRunning: (isScanRunning: boolean) => set({ isScanRunning }),
      setScanStep: (scanStep: ScanStepType) => set({ scanStep }),
      setNeuroScanId: (neuroScanId: string) => set({ neuroScanId }),
    }),
    {
      name: 'welcomeUserStore',
    }
  )
);
