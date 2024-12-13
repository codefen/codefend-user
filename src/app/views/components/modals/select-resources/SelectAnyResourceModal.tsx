import { useEffect, useState, type FC } from 'react';
import type { Issues } from '@interfaces/index';
import type { ScopeAlias } from '@interfaces/util.ts';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper';
import {
  BugIcon,
  CLoudIcon,
  GlobeWebIcon,
  LanIcon,
  MobileIcon,
  PeopleGroupIcon,
  Show,
  SourceCodeIcon,
} from '../..';
import useModalStore from '@stores/modal.store';
import { ResourceFigure } from '@standalones/resource-figure/ResourceFigure';
import { ViewResourcesTable } from './ViewResourcesTable';
import { useReportStore } from '@stores/report.store';
import { ViewAppCard } from './ViewAppCard';
import { useNavigate } from 'react-router';
import './report-type.scss';
import { MODAL_KEY_OPEN, RESOURCE_CLASS, RESOURCE_CLASS_ALIAS } from '@/app/constants/app-texts';

interface SelectAnyResourceModalProps {
  issues: Issues[];
}

const getIssueResourceCountV2 = (issues: Issues[], resourceClasses: string[]) => {
  const initialCounts: Record<string, number> = {};
  for (const resourceClass of resourceClasses) {
    initialCounts[resourceClass] = 0;
  }
  initialCounts[RESOURCE_CLASS.UNKNOWN] = 0;
  initialCounts[RESOURCE_CLASS.RESEARCH] = 0;
  return issues.reduce((acc, issue) => {
    const isOrphan = issue.resourceClass === RESOURCE_CLASS.RESEARCH || !issue.resourceID;
    const belongsToClass = resourceClasses.includes(issue.resourceClass);

    if (isOrphan) {
      acc[RESOURCE_CLASS.RESEARCH]++;
    } else if (belongsToClass) {
      acc[issue.resourceClass]++;
    } else {
      acc[RESOURCE_CLASS.UNKNOWN]++;
    }
    return acc;
  }, initialCounts);
};

export const SelectAnyResourceModal: FC<SelectAnyResourceModalProps> = ({ issues }) => {
  const navigate = useNavigate();
  const { isOpen, modalId, setIsOpen } = useModalStore();
  const [activeView, setActiveView] = useState('selector');
  const [alias, setAlias] = useState<ScopeAlias>(RESOURCE_CLASS_ALIAS.WEB);
  const { openModal, setResourceID, setResourceType } = useReportStore(state => state);
  const [resourceCount, setResourceCount] = useState<Record<string, number>>({
    web: 0,
    mobile: 0,
    cloud: 0,
    social: 0,
    source: 0,
    lan: 0,
    research: 0,
  });
  useEffect(() => {
    setResourceCount(
      getIssueResourceCountV2(issues, [
        RESOURCE_CLASS.WEB,
        RESOURCE_CLASS.MOBILE,
        RESOURCE_CLASS.CLOUD,
        RESOURCE_CLASS.SOCIAL,
        RESOURCE_CLASS.SOURCE,
        'lan',
      ])
    );
  }, [issues]);

  const handleChangeView = (view: string, alias: ScopeAlias) => {
    setActiveView(view);
    setAlias(alias);
  };

  const handleClose = () => {
    if (activeView !== 'selector') {
      setActiveView('selector');
    } else {
      setIsOpen(false);
    }
  };

  const handleReportForTable = (id: string, type: string, count: number) => {
    if (modalId == MODAL_KEY_OPEN.SELECT_REPORT) {
      if (count >= 1) {
        setIsOpen(false);
        setActiveView('selector');
        openModal();
        setResourceID(id);
        setResourceType(type == RESOURCE_CLASS.NETWORK ? 'lan' : type);
      }
    } else if (modalId == MODAL_KEY_OPEN.SELECT_FINDING) {
      setIsOpen(false);
      navigate(`/issues/create/${type == RESOURCE_CLASS.NETWORK ? 'lan' : type}/${id}`);
    }
  };
  const handleResearch = () => {
    if (modalId == MODAL_KEY_OPEN.SELECT_FINDING) {
      navigate(`/issues/create/research`);
    }
  };
  const title =
    modalId == MODAL_KEY_OPEN.SELECT_REPORT
      ? 'Choose the resource class to generate the report'
      : 'Choose the resource class you want to create the issues for';
  const header =
    modalId == MODAL_KEY_OPEN.SELECT_REPORT ? 'Select report type' : 'Create new issue';

  return (
    <ModalTitleWrapper
      headerTitle={header}
      isActive={
        isOpen &&
        (modalId == MODAL_KEY_OPEN.SELECT_REPORT || modalId == MODAL_KEY_OPEN.SELECT_FINDING)
      }
      close={handleClose}>
      <div
        className={`report-type-modal ${activeView !== 'selector' && 'type-selector-container'}`}>
        <Show when={activeView === 'selector'}>
          <h3>{title}</h3>
          <div className="report-type-container">
            <ResourceFigure
              icon={<GlobeWebIcon />}
              title={RESOURCE_CLASS.WEB}
              count={resourceCount[RESOURCE_CLASS.WEB]}
              click={() => handleChangeView(RESOURCE_CLASS.WEB, RESOURCE_CLASS_ALIAS.WEB)}
              isActive={
                resourceCount[RESOURCE_CLASS.WEB] > 0 || modalId == MODAL_KEY_OPEN.SELECT_FINDING
              }
            />
            <ResourceFigure
              icon={<MobileIcon />}
              title={RESOURCE_CLASS.MOBILE}
              count={resourceCount[RESOURCE_CLASS.MOBILE]}
              click={() => handleChangeView(RESOURCE_CLASS.MOBILE, RESOURCE_CLASS_ALIAS.MOBILE)}
              isActive={
                resourceCount[RESOURCE_CLASS.MOBILE] > 0 || modalId == MODAL_KEY_OPEN.SELECT_FINDING
              }
            />

            <ResourceFigure
              icon={<CLoudIcon />}
              title={RESOURCE_CLASS.CLOUD}
              count={resourceCount[RESOURCE_CLASS.CLOUD]}
              click={() => handleChangeView(RESOURCE_CLASS.CLOUD, RESOURCE_CLASS_ALIAS.CLOUD)}
              isActive={
                resourceCount[RESOURCE_CLASS.CLOUD] > 0 || modalId == MODAL_KEY_OPEN.SELECT_FINDING
              }
            />

            <ResourceFigure
              icon={<SourceCodeIcon />}
              title={RESOURCE_CLASS.SOURCE}
              count={resourceCount[RESOURCE_CLASS.SOURCE]}
              click={() => handleChangeView(RESOURCE_CLASS.SOURCE, RESOURCE_CLASS_ALIAS.SOURCE)}
              isActive={
                resourceCount[RESOURCE_CLASS.SOURCE] > 0 || modalId == MODAL_KEY_OPEN.SELECT_FINDING
              }
            />

            <ResourceFigure
              icon={<PeopleGroupIcon />}
              title={RESOURCE_CLASS.SOCIAL}
              count={resourceCount[RESOURCE_CLASS.SOCIAL]}
              click={() => handleChangeView(RESOURCE_CLASS.SOCIAL, RESOURCE_CLASS_ALIAS.SOCIAL)}
              isActive={
                resourceCount[RESOURCE_CLASS.SOCIAL] > 0 || modalId == MODAL_KEY_OPEN.SELECT_FINDING
              }
            />

            <ResourceFigure
              icon={<LanIcon />}
              title={RESOURCE_CLASS.NETWORK}
              count={resourceCount['lan']}
              click={() => handleChangeView(RESOURCE_CLASS.NETWORK, RESOURCE_CLASS_ALIAS.NETWORK)}
              isActive={resourceCount['lan'] > 0 || modalId == MODAL_KEY_OPEN.SELECT_FINDING}
            />

            <ResourceFigure
              icon={<BugIcon />}
              title={RESOURCE_CLASS.RESEARCH}
              count={resourceCount[RESOURCE_CLASS.RESEARCH]}
              isActive={
                resourceCount[RESOURCE_CLASS.RESEARCH] > 0 ||
                modalId == MODAL_KEY_OPEN.SELECT_FINDING
              }
              click={handleResearch}
            />
          </div>
        </Show>
        <Show
          when={
            activeView !== 'selector' &&
            activeView !== RESOURCE_CLASS.MOBILE &&
            activeView !== RESOURCE_CLASS.CLOUD
          }>
          <ViewResourcesTable
            scopeALias={alias}
            type={activeView}
            handleSelect={handleReportForTable}
            activeFilter={modalId !== MODAL_KEY_OPEN.SELECT_FINDING}
            modalId={modalId}
          />
        </Show>
        <Show when={activeView === RESOURCE_CLASS.MOBILE || activeView === RESOURCE_CLASS.CLOUD}>
          <ViewAppCard
            getReport={handleReportForTable}
            scopeALias={alias}
            type={activeView}
            activeFilter={modalId !== MODAL_KEY_OPEN.SELECT_FINDING}
            modalId={modalId}
          />
        </Show>
      </div>
    </ModalTitleWrapper>
  );
};
