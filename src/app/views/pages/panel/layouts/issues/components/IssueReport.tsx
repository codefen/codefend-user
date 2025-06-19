import { type FC, Fragment, useCallback, useMemo, useState } from 'react';
import { type IssueClass, type Issues } from '@interfaces/panel.ts';
import { ChartIcon, ChevronIcon, FilterIcon, StatIcon } from '@icons';
import Show from '@/app/views/components/Show/Show';
import { SimpleSection } from '@/app/views/components/SimpleSection/SimpleSection';
import { ResourcesTypes } from '@interfaces/order';
import type { FilterGroup, FilterState } from '@interfaces/issues';

interface Props {
  isLoading: boolean;
  issuesClasses: IssueClass;
  handleFilter: (filterType: keyof FilterState, value: string) => void;
  issues: Issues[];
  currentFilters: FilterState;
}

const FILTER_RESOURCE_CLASS_GROUP: Omit<FilterGroup, 'elements'> = {
  title: 'Resource Class',
  type: 'resourceClass',
};

const FILTER_ISSUE_RISK_SCORE_GROUP: Omit<FilterGroup, 'elements'> = {
  title: 'Risk Score',
  type: 'riskScore',
};

const RESOURCE_CLASS_ELEMENTS = [
  { label: 'Web', value: ResourcesTypes.WEB },
  { label: 'Leaks', value: ResourcesTypes.LEAKS },
  { label: 'Mobile', value: ResourcesTypes.MOBILE },
  { label: 'Network', value: ResourcesTypes.NETWORK },
  { label: 'Social Engineering', value: ResourcesTypes.SOCIAL },
];

const RISK_SCORE_ELEMENTS = [
  { label: 'Intel', value: '1' },
  { label: 'Low', value: '2' },
  { label: 'Medium', value: '3' },
  { label: 'Elevated', value: '4' },
  { label: 'Critical', value: '5' },
];

export const IssueReport: FC<Props> = ({ issues, currentFilters, handleFilter }) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    resourceClass: true,
    riskScore: false,
    scanId: false,
  });

  const toggleGroup = useCallback((groupType: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupType]: !prev[groupType],
    }));
  }, []);

  const calculateTotals = useCallback((issues: Issues[]) => {
    const totals = {
      resourceClass: {} as Record<string, number>,
      riskScore: {} as Record<string, number>,
      scanId: {} as Record<string, number>,
    };

    issues.forEach(issue => {
      // Resource class totals
      totals.resourceClass[issue.resourceClass] =
        (totals.resourceClass[issue.resourceClass] || 0) + 1;

      // Risk score totals
      totals.riskScore[issue.riskScore] = (totals.riskScore[issue.riskScore] || 0) + 1;

      // Scan ID totals (solo para Web)
      if (
        (issue.scanId && issue.resourceClass === ResourcesTypes.WEB) ||
        issue.resourceClass === ResourcesTypes.LEAKS
      ) {
        totals.scanId[issue.scanId] = (totals.scanId[issue.scanId] || 0) + 1;
      }
    });

    return totals;
  }, []);

  const filterGroups = useMemo(() => {
    if (issues.length === 0) return [];

    const totals = calculateTotals(issues);
    const groups: FilterGroup[] = [];

    // Resource Class Group
    const resourceClassElements = RESOURCE_CLASS_ELEMENTS.map(element => ({
      ...element,
      total: totals.resourceClass[element.value] || 0,
    }));

    groups.push({
      ...FILTER_RESOURCE_CLASS_GROUP,
      elements: resourceClassElements,
    });

    // Scan ID Group (solo si hay scans de Web)
    const scanIdElements = Object.entries(totals.scanId).map(([scanId, total]) => ({
      label: scanId,
      value: scanId,
      total,
    }));

    if (scanIdElements.length > 0) {
      groups.push({
        title: 'Scan Identifier',
        type: 'scanId' as keyof FilterState,
        elements: scanIdElements,
      });
    }

    // Risk Score Group
    const riskScoreElements = RISK_SCORE_ELEMENTS.map(element => ({
      ...element,
      total: totals.riskScore[element.value] || 0,
    }));

    groups.push({
      ...FILTER_ISSUE_RISK_SCORE_GROUP,
      elements: riskScoreElements,
    });

    return groups.filter(group => group.elements.some(element => element.total > 0));
  }, [issues, calculateTotals]);

  return (
    <div className="card filtered">
      <div className="header">
        <FilterIcon />
        <span>Filter Issues</span>
      </div>
      <div className="content filters">
        {filterGroups.map((group, groupIndex) => (
          <div
            key={groupIndex}
            className={`filter-group ${expandedGroups[group.type] ? 'expanded' : ''}`}>
            <button className="filter-group-btn" onClick={() => toggleGroup(group.type)}>
              <ChevronIcon />
              <h3>{group.title}</h3>
            </button>
            <div className="filter-group-content">
              {group.elements.map((element, elementIndex) => (
                <label
                  className="filter"
                  key={`${groupIndex}-${elementIndex}`}
                  htmlFor={`${group.type}-${element.value}`}>
                  <div className="check">
                    <div className="label">
                      <input
                        type="checkbox"
                        disabled={element.total === 0}
                        checked={currentFilters[group.type].includes(element.value.toString())}
                        onChange={() => handleFilter(group.type, element.value.toString())}
                        className="codefend-checkbox"
                        id={`${group.type}-${element.value}`}
                      />
                      {element.label}
                    </div>
                  </div>
                  <div className="value">
                    <Show
                      when={element.total === 0}
                      fallback={<img src="/codefend/issues-bug-icon.svg" alt="bug-icon" />}>
                      <img src="/codefend/issues-bug-grey.svg" alt="bug-icon" />
                    </Show>
                    <span>{element.total}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
