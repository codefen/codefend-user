import { type FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useIssues } from '@panelHooks/issues/useIssues.ts';
import { APP_EVENT_TYPE, USER_LOGGING_STATE, type Issues } from '@interfaces/panel.ts';
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
import { ResourcesTypes } from '@interfaces/order';
import { useSearchParams } from 'react-router-dom';
import { useFiltersWithURL } from '@panelHooks/issues/useFiltersWithURL.ts';
import { useFilteredIssues } from '@panelHooks/issues/useFilteredIssues.ts';
import type { FilterState } from '@interfaces/issues.ts';
import Navbar from '@/app/views/components/navbar/Navbar';

const IssuesPanel: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
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
  const { appEvent, userLoggingState } = useGlobalFastFields(['appEvent', 'userLoggingState']);

  const handleFilters = (filterType: string, value: string) => {
    const key = filterType as keyof FilterState;
    setFilters(prev => {
      const currentFilters = prev[key];
      const updated = currentFilters.includes(value)
        ? currentFilters.filter(filter => filter !== value)
        : [...currentFilters, value];

      // Get current URL parameters
      const currentParams = Object.fromEntries(searchParams.entries());

      // If we're selecting a scan ID, ensure only web resource type is selected
      if (filterType === 'scanId') {
        if (currentFilters.includes(value)) {
          // Remove scan_id from URL when unchecking
          delete currentParams['scan_id'];
          // Also remove web resource type if it was only added for this scan
          if (prev.resourceClass.length === 1 && prev.resourceClass[0] === ResourcesTypes.WEB) {
            delete currentParams['resourceClass'];
          }
        } else {
          // Add scan_id to URL when checking
          currentParams['scan_id'] = value;
          // Force only WEB resource type
          currentParams['resourceClass'] = ResourcesTypes.WEB;
        }
        setSearchParams(currentParams);
        return {
          ...prev,
          [key]: updated,
          // When selecting scan_id, only allow WEB resource type
          resourceClass: currentFilters.includes(value)
            ? prev.resourceClass.filter(r => r !== ResourcesTypes.WEB)
            : [ResourcesTypes.WEB],
        };
      }

      // If we're selecting a resource type
      if (filterType === 'resourceClass') {
        if (currentFilters.includes(value)) {
          // If unchecking web resource type, also remove scan_id
          if (value === ResourcesTypes.WEB) {
            delete currentParams['scan_id'];
          }
          // Update resourceClass in URL
          const newResourceClass = prev.resourceClass.filter(r => r !== value);
          if (newResourceClass.length > 0) {
            currentParams['resourceClass'] = newResourceClass.join(',');
          } else {
            delete currentParams['resourceClass'];
          }
        } else {
          // If selecting a non-WEB resource type, remove scan_id
          if (value !== ResourcesTypes.WEB) {
            delete currentParams['scan_id'];
          }
          // Add new resource type to URL
          const newResourceClass = [...prev.resourceClass, value];
          currentParams['resourceClass'] = newResourceClass.join(',');
        }
        setSearchParams(currentParams);
        return {
          ...prev,
          [key]: updated,
          // If selecting non-WEB or unchecking WEB, clear scan IDs
          scanId: value !== ResourcesTypes.WEB || currentFilters.includes(value) ? [] : prev.scanId,
        };
      }

      // Handle other filter types (riskScore, orderIdentifier)
      if (!currentFilters.includes(value)) {
        // Add new filter to URL
        const currentValues = currentParams[filterType] ? currentParams[filterType].split(',') : [];
        currentValues.push(value);
        currentParams[filterType] = currentValues.join(',');
      } else {
        // Remove filter from URL
        const currentValues = currentParams[filterType] ? currentParams[filterType].split(',') : [];
        const newValues = currentValues.filter(v => v !== value);
        if (newValues.length > 0) {
          currentParams[filterType] = newValues.join(',');
        } else {
          delete currentParams[filterType];
        }
      }
      setSearchParams(currentParams);

      return {
        ...prev,
        [key]: updated,
      };
    });
  };

  // Handle URL parameters for filtering
  useEffect(() => {
    const scanId = searchParams.get('scan_id');
    const resourceClass = searchParams.get('resourceClass');
    const orderIdentifier = searchParams.get('orderIdentifier');
    const riskScore = searchParams.get('riskScore');

    if (issues.length > 0) {
      setFilters(prev => {
        const newFilters = { ...prev };

        if (scanId) {
          const hasMatchingIssue = issues.some((issue: Issues) => issue.scanId === scanId);
          if (hasMatchingIssue) {
            // console.log(`Found matching issue with scan_id: ${scanId}`);
            newFilters.scanId = [scanId];
            // Force only WEB resource type when scan_id is present
            newFilters.resourceClass = [ResourcesTypes.WEB];
          } else {
            // console.log(`No issues found with scan_id: ${scanId}`);
          }
        }

        if (resourceClass) {
          const resourceClasses = resourceClass.split(',');
          // If there's a non-WEB resource type, remove scan_id
          if (resourceClasses.some(r => r !== ResourcesTypes.WEB)) {
            newFilters.scanId = [];
          }
          newFilters.resourceClass = resourceClasses;
        }

        if (orderIdentifier) {
          newFilters.orderIdentifier = orderIdentifier.split(',');
        }

        if (riskScore) {
          newFilters.riskScore = riskScore.split(',');
        }

        return newFilters;
      });
    }
  }, [searchParams, issues]);

  useEffect(() => {
    if (userLoggingState.get !== USER_LOGGING_STATE.LOGGED_OUT) {
      refetchAll();
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
        <IssueResources
          isLoading={isLoading}
          issues={handleIssuesFilter.isFiltered ? handleIssuesFilter.filteredData : issues}
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
            isDisabled={!Boolean(issues.length) && !Boolean(handleIssuesFilter.filteredData.length)}
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
  );
};
