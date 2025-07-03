import { type FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useIssues } from '@panelHooks/issues/useIssues.ts';
import { APP_EVENT_TYPE, USER_LOGGING_STATE, type Issues } from '@interfaces/panel.ts';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { VulnerabilitiesStatus } from '@/app/views/components/VulnerabilitiesStatus/VulnerabilitiesStatus.tsx';
import { VulnerabilityRisk } from '@/app/views/components/VulnerabilityRisk/VulnerabilityRisk.tsx';
import { PrimaryButton } from '@buttons/primary/PrimaryButton.tsx';
import { IssueReport } from '../components/IssueReport.tsx';
import { IssueResources } from '../components/IssueResources.tsx';
import { SelectAnyResourceModal } from '@modals/select-resources/SelectAnyResourceModal.tsx';
import useModalStore from '@stores/modal.store.ts';
import { EMPTY_ISSUECLASS, EMPTY_ISSUECONDITION, EMPTY_SHARE } from '@/app/constants/empty.ts';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts.ts';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider.tsx';
import { IssuePanelHeader } from '@/app/views/pages/panel/layouts/issues/components/IssuePanelHeader.tsx';
import { useFiltersWithURL } from '@panelHooks/issues/useFiltersWithURL.ts';
import { useFilteredIssues } from '@panelHooks/issues/useFilteredIssues.ts';
import { useFlashlight } from '@/app/views/context/FlashLightContext.tsx';
import { SectionTracker } from '@/app/views/components/telemetry/SectionTracker';
import Navbar from '@/app/views/components/navbar/Navbar';

const IssuesPanel: FC = () => {
  const [showScreen, control, refresh] = useShowScreen();
  const { issues, others, isLoading, refetchAll } = useIssues();
  const { setIsOpen, setModalId } = useModalStore();
  const flashlight = useFlashlight();
  const { appEvent, userLoggingState } = useGlobalFastFields(['appEvent', 'userLoggingState']);

  const { filters, handleFilters } = useFiltersWithURL(issues);
  const { filteredData, isFiltered } = useFilteredIssues(issues, filters);

  useEffect(() => {
    if (userLoggingState.get !== USER_LOGGING_STATE.LOGGED_OUT) {
      refetchAll();
      appEvent.set(APP_EVENT_TYPE.VULNERABILITIES_PAGE_CONDITION);
    }
  }, [control]);

  const handleAddFinding = useCallback(() => {
    setIsOpen(true);
    setModalId(MODAL_KEY_OPEN.SELECT_FINDING);
  }, []);

  const displayIssues = isFiltered ? filteredData : issues;

  return (
    <SectionTracker sectionName="issues">
    <main className={`issues-list ${showScreen ? 'actived' : ''}`}>
      <SelectAnyResourceModal issues={displayIssues} />
      {/* <div className="brightness variant-1"></div> */}
      <section className="left">
        <IssueResources
          isLoading={isLoading}
          issues={displayIssues}
          refresh={refresh}
          addFinding={handleAddFinding}
        />
      </section>
      <section className="right" ref={flashlight.rightPaneRef}>
          <Navbar />
        <IssuePanelHeader openAddIssue={handleAddFinding} />
        <IssueReport
          handleFilter={handleFilters}
          isLoading={isLoading}
          issuesClasses={others?.issueClass || EMPTY_ISSUECLASS}
          issues={issues}
          currentFilters={filters}
        />
        {/* BOTÓN GENERATE REPORT TEMPORALMENTE OCULTO
        <div className="card only-button">
          <PrimaryButton
            text="GENERATE REPORT"
            click={e => {
              setIsOpen(true);
              setModalId(MODAL_KEY_OPEN.SELECT_REPORT);
            }}
            className="full margin-block"
            isDisabled={!Boolean(displayIssues.length)}
            disabledLoader
          />
        </div>
        */}
        <VulnerabilitiesStatus
          vulnerabilityByShare={others?.issueCondition || EMPTY_ISSUECONDITION}
        />

        <VulnerabilityRisk
          isLoading={isLoading}
          vulnerabilityByRisk={others?.issueShare || EMPTY_SHARE}
        />
      </section>
    </main>
    </SectionTracker>
  );
};

export default IssuesPanel;
