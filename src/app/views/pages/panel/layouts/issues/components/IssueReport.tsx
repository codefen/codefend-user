import { type FC, Fragment, useMemo, useState } from 'react';
import { type IssueClass, type Issues } from '@interfaces/panel.ts';
import { ChartIcon, ChevronIcon, StatIcon } from '@icons';
import Show from '@/app/views/components/Show/Show';
import { SimpleSection } from '@/app/views/components/SimpleSection/SimpleSection';
import { ResourcesTypes } from '@interfaces/order';

interface FilterElement {
  label: string;
  value: string | ResourcesTypes;
  total: number;
}

interface FilterGroup {
  title: string;
  type: string;
  elements: FilterElement[];
}

interface Props {
  isLoading: boolean;
  issuesClasses: IssueClass;
  handleFilter: (filterType: string, value: string) => void;
  issues: Issues[];
}

const FILTER_RESOURCE_CLASS_GROUP = {
  title: 'Resource Class',
  type: 'resourceClass',
  elements: [
    {
      label: 'Web',
      value: ResourcesTypes.WEB,
      total: 0,
    },
    {
      label: 'Mobile',
      value: ResourcesTypes.MOBILE,
      total: 0,
    },
    {
      label: 'Network',
      value: ResourcesTypes.NETWORK,
      total: 0,
    },
    {
      label: 'Social Engineering',
      value: ResourcesTypes.SOCIAL,
      total: 0,
    },
  ],
};

const FILTER_ISSUE_RISK_SCORE_GROUP = {
  title: 'Risk Score',
  type: 'riskScore',
  elements: [
    {
      label: 'Intel',
      value: '1',
      total: 0,
    },
    {
      label: 'Low',
      value: '2',
      total: 0,
    },
    {
      label: 'Medium',
      value: '3',
      total: 0,
    },
    {
      label: 'Elevated',
      value: '4',
      total: 0,
    },
    {
      label: 'Critical',
      value: '5',
      total: 0,
    },
  ],
};

export const IssueReport: FC<Props> = props => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    resourceClass: true, // Default expanded
    riskScore: false,
    scanId: false,
  });

  const toggleGroup = (groupType: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupType]: !prev[groupType],
    }));
  };

  const filterGroups = useMemo(() => {
    // Calculate scan identifiers with a single reduce operation
    const scanIds = props.issues.reduce((acc, issue) => {
      if (!issue.scanId) return acc;

      const existing = acc.find(item => item.value === issue.scanId);
      if (existing) {
        existing.total++;
      } else {
        acc.push({
          label: issue.scanId,
          value: issue.scanId,
          total: 1,
        });
      }
      return acc;
    }, [] as FilterElement[]);

    const resourceClassWithTotals = FILTER_RESOURCE_CLASS_GROUP.elements.map(element => ({
      ...element,
      total: props.issues.filter(issue => issue.resourceClass === element.value).length,
    }));

    const riskScoreWithTotals = FILTER_ISSUE_RISK_SCORE_GROUP.elements.map(element => ({
      ...element,
      total: props.issues.filter(issue => issue.riskScore === element.value).length,
    }));

    const groups: FilterGroup[] = [
      { ...FILTER_RESOURCE_CLASS_GROUP, elements: resourceClassWithTotals },
    ];

    if (scanIds.length > 0) {
      groups.push({
        title: 'Scan Identifier',
        type: 'scanId',
        elements: scanIds,
      });
    }

    groups.push({ ...FILTER_ISSUE_RISK_SCORE_GROUP, elements: riskScoreWithTotals });

    return groups.filter(group => group.elements.some(element => element.total > 0));
  }, [props.issues]);

  return (
    <div className="card filtered">
      <SimpleSection header="Filter Issues" icon={<StatIcon />}>
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
                          onChange={() => props.handleFilter(group.type, element.value.toString())}
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
      </SimpleSection>
    </div>
  );
};
