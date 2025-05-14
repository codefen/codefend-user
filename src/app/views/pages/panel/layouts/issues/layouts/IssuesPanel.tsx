import { type FC, useEffect, useMemo, useState } from 'react';
import { useIssues } from '@panelHooks/issues/useIssues.ts';
import { type Issues } from '@interfaces/panel.ts';
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

const IssuesPanel: FC = () => {
  const [showScreen, control, refresh] = useShowScreen();
  const [filters, setFilters] = useState<string[]>([]);
  const { issues, others, isLoading, refetchAll } = useIssues();
  const { setIsOpen, setModalId } = useModalStore();
  const flashlight = useFlashlight();

  useEffect(() => {
    refetchAll();
  }, [control]);

  const handleIssuesFilter = useMemo(() => {
    const isFiltered = filters.length !== 0;
    if (!isFiltered) return { filteredData: [], isFiltered };

    const filteredData = issues.filter((issue: Issues) => filters.includes(issue.resourceClass));

    return { filteredData, isFiltered };
  }, [filters, issues]);

  const handleFilters = (issueClass: string) => {
    if (filters.includes(issueClass)) {
      const updated = filters.filter(filter => filter !== issueClass);
      setFilters(updated);
    } else {
      setFilters([...filters, issueClass]);
    }
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
      <ModalReport />
      <div className="brightness variant-1"></div>
      <section className="left">
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
        />
        <div className="card">
          <PrimaryButton
            text="GENERATE REPORT"
            click={e => {
              setIsOpen(true);
              setModalId(MODAL_KEY_OPEN.SELECT_REPORT);
            }}
            className="primary-full margin-block"
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
