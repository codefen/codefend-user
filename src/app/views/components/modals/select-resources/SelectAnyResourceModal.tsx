import { useEffect, useState, type FC } from 'react';
import type { Issues } from '@interfaces/index';
import type { ScopeAlias } from '@interfaces/util.ts';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper';
import useModalStore from '@stores/modal.store';
import { ResourceFigure } from '@/app/views/components/resource-figure/ResourceFigure';
import { ViewResourcesTable } from './ViewResourcesTable';
import { ViewAppCard } from './ViewAppCard';
import { useNavigate } from 'react-router';
import './report-type.scss';
import { MODAL_KEY_OPEN, RESOURCE_CLASS, RESOURCE_CLASS_ALIAS } from '@/app/constants/app-texts';
import Show from '@/app/views/components/Show/Show';
import {
  BugIcon,
  CLoudIcon,
  GlobeWebIcon,
  LanIcon,
  MobileIcon,
  PeopleGroupIcon,
  SourceCodeIcon,
} from '@icons';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';


const SelectorIcon = ({ type }: { type: 'web' | 'mobile' | 'social' | 'network' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {type === 'web' && <><rect x="2.5" y="4" width="19" height="15" rx="2"/><path d="M2.5 8h19M6 6h.01M9 6h.01M10 11l-2 2 2 2m4-4 2 2-2 2"/></>}
    {type === 'mobile' && <><rect x="6.5" y="2" width="11" height="20" rx="2"/><path d="M10 5h4m-3 14h2"/></>}
    {type === 'social' && <><circle cx="9" cy="8" r="3"/><path d="M3 20v-1a6 6 0 0 1 12 0v1M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 5v1"/></>}
    {type === 'network' && <><rect x="2" y="3" width="20" height="7" rx="2"/><rect x="2" y="14" width="20" height="7" rx="2"/><path d="M6 6.5h.01M6 17.5h.01M10 6.5h8M10 17.5h8"/></>}
  </svg>
);

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
  const { resourceID, resourceType, openModal } = useGlobalFastFields([
    'openModal',
    'resourceID',
    'resourceType',
  ]);
  const [resourceCount, setResourceCount] = useState<Record<string, number>>({
    web: 0,
    mobile: 0,
    //cloud: 0,
    social: 0,
    //source: 0,
    lan: 0,
    research: 0,
  });
  useEffect(() => {
    setResourceCount(
      getIssueResourceCountV2(issues, [
        RESOURCE_CLASS.WEB,
        RESOURCE_CLASS.MOBILE,
        //RESOURCE_CLASS.CLOUD,
        RESOURCE_CLASS.SOCIAL,
        //RESOURCE_CLASS.SOURCE,
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

  const handleReportForTable = (id: string, type: RESOURCE_CLASS, count: number) => {
    if (modalId == MODAL_KEY_OPEN.SELECT_REPORT) {
      if (count >= 1) {
        setIsOpen(false);
        setActiveView('selector');
        openModal.set(true);
        resourceID.set(id);
        resourceType.set(type == RESOURCE_CLASS.NETWORK ? RESOURCE_CLASS.LAN_NET : type);
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
      close={handleClose}
      type="modal-report-selector">
      <div
        className={`report-type-modal ${activeView !== 'selector' && 'type-selector-container'}`}>
        <Show when={activeView === 'selector'}>
          <h3>{title}</h3>
          <div className="report-type-container">
            <ResourceFigure
              icon={<SelectorIcon type="web" />}
              title={RESOURCE_CLASS.WEB}
              count={resourceCount[RESOURCE_CLASS.WEB]}
              click={() => handleChangeView(RESOURCE_CLASS.WEB, RESOURCE_CLASS_ALIAS.WEB)}
              isActive={
                resourceCount[RESOURCE_CLASS.WEB] > 0 || modalId == MODAL_KEY_OPEN.SELECT_FINDING
              }
            />
            <ResourceFigure
              icon={<SelectorIcon type="mobile" />}
              title={RESOURCE_CLASS.MOBILE}
              count={resourceCount[RESOURCE_CLASS.MOBILE]}
              click={() => handleChangeView(RESOURCE_CLASS.MOBILE, RESOURCE_CLASS_ALIAS.MOBILE)}
              isActive={
                resourceCount[RESOURCE_CLASS.MOBILE] > 0 || modalId == MODAL_KEY_OPEN.SELECT_FINDING
              }
            />

            {/* <ResourceFigure
              icon={<CLoudIcon />}
              title={RESOURCE_CLASS.CLOUD}
              count={resourceCount[RESOURCE_CLASS.CLOUD]}
              click={() => handleChangeView(RESOURCE_CLASS.CLOUD, RESOURCE_CLASS_ALIAS.CLOUD)}
              isActive={
                resourceCount[RESOURCE_CLASS.CLOUD] > 0 || modalId == MODAL_KEY_OPEN.SELECT_FINDING
              }
            /> */}

            {/* <ResourceFigure
              icon={<SourceCodeIcon />}
              title={RESOURCE_CLASS.SOURCE}
              count={resourceCount[RESOURCE_CLASS.SOURCE]}
              click={() => handleChangeView(RESOURCE_CLASS.SOURCE, RESOURCE_CLASS_ALIAS.SOURCE)}
              isActive={
                resourceCount[RESOURCE_CLASS.SOURCE] > 0 || modalId == MODAL_KEY_OPEN.SELECT_FINDING
              }
            /> */}

            <ResourceFigure
              icon={<SelectorIcon type="social" />}
              title={RESOURCE_CLASS.SOCIAL}
              count={resourceCount[RESOURCE_CLASS.SOCIAL]}
              click={() => handleChangeView(RESOURCE_CLASS.SOCIAL, RESOURCE_CLASS_ALIAS.SOCIAL)}
              isActive={
                resourceCount[RESOURCE_CLASS.SOCIAL] > 0 || modalId == MODAL_KEY_OPEN.SELECT_FINDING
              }
            />

            <ResourceFigure
              icon={<SelectorIcon type="network" />}
              title={RESOURCE_CLASS.NETWORK}
              count={resourceCount['lan']}
              click={() => handleChangeView(RESOURCE_CLASS.NETWORK, RESOURCE_CLASS_ALIAS.NETWORK)}
              isActive={resourceCount['lan'] > 0 || modalId == MODAL_KEY_OPEN.SELECT_FINDING}
            />

            {/* <ResourceFigure
              icon={<BugIcon />}
              title={RESOURCE_CLASS.RESEARCH}
              count={resourceCount[RESOURCE_CLASS.RESEARCH]}
              isActive={
                resourceCount[RESOURCE_CLASS.RESEARCH] > 0 ||
                modalId == MODAL_KEY_OPEN.SELECT_FINDING
              }
              click={handleResearch}
            /> */}
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
            type={activeView as RESOURCE_CLASS}
            handleSelect={handleReportForTable}
            activeFilter={modalId !== MODAL_KEY_OPEN.SELECT_FINDING}
            modalId={modalId}
          />
        </Show>
        <Show when={activeView === RESOURCE_CLASS.MOBILE || activeView === RESOURCE_CLASS.CLOUD}>
          <ViewAppCard
            getReport={handleReportForTable}
            scopeALias={alias}
            type={activeView as RESOURCE_CLASS}
            activeFilter={modalId !== MODAL_KEY_OPEN.SELECT_FINDING}
            modalId={modalId}
          />
        </Show>
      </div>
    </ModalTitleWrapper>
  );
};
