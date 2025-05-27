import { type FC, useEffect, useMemo, useState } from 'react';
import { useIssues } from '@panelHooks/issues/useIssues.ts';
import { APP_EVENT_TYPE, type Issues } from '@interfaces/panel.ts';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { VulnerabilitiesStatus } from '@/app/views/components/VulnerabilitiesStatus/VulnerabilitiesStatus.tsx';
import { VulnerabilityRisk } from '@/app/views/components/VulnerabilityRisk/VulnerabilityRisk.tsx';
import { PrimaryButton } from '@buttons/primary/PrimaryButton.tsx';
import { IssueReport } from '../components/IssueReport.tsx';
import { IssueResources } from '../components/IssueResources.tsx';
import { useFlashlight } from '../../../../../context/FlashLightContext.tsx';
import { SelectAnyResourceModal } from '@modals/select-resources/SelectAnyResourceModal.tsx';
import useModalStore from '@stores/modal.store.ts';
import { EMPTY_ISSUECLASS, EMPTY_ISSUECONDITION, EMPTY_SHARE } from '@/app/constants/empty.ts';
import { ModalReport } from '@modals/reports/ModalReport.tsx';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts.ts';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider.tsx';
import { IssuePanelHeader } from '@/app/views/pages/panel/layouts/issues/components/IssuePanelHeader.tsx';

interface FilterState {
  resourceClass: string[];
  scanId: string[];
  orderIdentifier: string[];
  riskScore: string[];
}

const IssuesPanel: FC = () => {
  const [showScreen, control, refresh] = useShowScreen();
  const [filters, setFilters] = useState<FilterState>({
    resourceClass: [],
    scanId: [],
    orderIdentifier: [],
    riskScore: [],
  });
  const { issues, others, isLoading, refetchAll } = useIssues();
  const { setIsOpen, setModalId } = useModalStore();
  const flashlight = useFlashlight();
  const { appEvent } = useGlobalFastFields(['appEvent']);
  useEffect(() => {
    refetchAll();
    if (appEvent.get !== APP_EVENT_TYPE.USER_LOGGED_OUT) {
      appEvent.set(APP_EVENT_TYPE.VULNERABILITIES_PAGE_CONDITION);
    }
  }, [control]);

  const handleIssuesFilter = useMemo(() => {
    const isFiltered = Object.values(filters).some(arr => arr.length > 0);
    if (!isFiltered) return { filteredData: [], isFiltered };

    const filteredData = issues.filter((issue: Issues) => {
      const matchesResourceClass =
        filters.resourceClass.length === 0 || filters.resourceClass.includes(issue.resourceClass);
      const matchesscanId = filters.scanId.length === 0 || filters.scanId.includes(issue.scanId);
      const matchesOrderIdentifier =
        filters.orderIdentifier.length === 0 ||
        filters.orderIdentifier.includes(issue.orderIdentifier);
      const matchesRiskScore =
        filters.riskScore.length === 0 || filters.riskScore.includes(issue.riskScore);

      return matchesResourceClass && matchesscanId && matchesOrderIdentifier && matchesRiskScore;
    });

    return { filteredData, isFiltered };
  }, [filters, issues]);

  const handleFilters = (filterType: string, value: string) => {
    const key = filterType as keyof FilterState;
    setFilters(prev => {
      const currentFilters = prev[key];
      const updated = currentFilters.includes(value)
        ? currentFilters.filter(filter => filter !== value)
        : [...currentFilters, value];

      return {
        ...prev,
        [key]: updated,
      };
    });
  };

  const handleAddFinding = () => {
    setIsOpen(true);
    setModalId(MODAL_KEY_OPEN.SELECT_FINDING);
  };

  return (
    <main className={`issues-list ${showScreen ? 'actived' : ''}`}>
      <SelectAnyResourceModal
        issues={handleIssuesFilter.isFiltered ? handleIssuesFilter.filteredData : issues}
      />
      <div className="brightness variant-1"></div>
      <section className="left">
        <IssuePanelHeader />
        <IssueResources
          isLoading={isLoading}
          issues={handleIssuesFilter.isFiltered ? handleIssuesFilter.filteredData : issues}
          refresh={refresh}
          addFinding={handleAddFinding}
        />
      </section>
      <section className="right" ref={flashlight.rightPaneRef}>
        <IssueReport
          handleFilter={handleFilters}
          isLoading={isLoading}
          issuesClasses={others?.issueClass || EMPTY_ISSUECLASS}
          issues={issues}
        />
        <div className="card only-button">
          <PrimaryButton
            text="GENERATE REPORT"
            click={e => {
              setIsOpen(true);
              setModalId(MODAL_KEY_OPEN.SELECT_REPORT);
            }}
            className="full margin-block"
            isDisabled={!Boolean(issues.length) && !Boolean(handleIssuesFilter.filteredData.length)}
            disabledLoader
          />
        </div>

        <VulnerabilityRisk
          isLoading={isLoading}
          vulnerabilityByRisk={others?.issueShare || EMPTY_SHARE}
        />
        <VulnerabilitiesStatus
          vulnerabilityByShare={others?.issueCondition || EMPTY_ISSUECONDITION}
        />
      </section>
    </main>
  );
};

export default IssuesPanel;
