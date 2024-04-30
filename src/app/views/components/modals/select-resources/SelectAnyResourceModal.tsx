import type { Issues } from '@interfaces/index';
import { ModalTitleWrapper } from '..';
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
import './report-type.scss';
import { useEffect, useRef, useState, type FC } from 'react';
import useModalStore from '@stores/modal.store';
import { ResourceFigure } from '@standalones/resource-figure/ResourceFigure';
import { ViewResourcesTable } from './ViewResourcesTable';
import { useReportStore } from '@stores/report.store';
import { ViewAppCard } from './ViewAppCard';
import { useNavigate } from 'react-router';

interface SelectAnyResourceModalProps {
	issues: Issues[];
}

const getIssueResourceCountV2 = (
	issues: Issues[],
	resourceClasses: string[],
) => {
	const initialCounts: Record<string, number> = {};
	for (const resourceClass of resourceClasses) {
		initialCounts[resourceClass] = 0;
	}
	initialCounts['unknown'] = 0;
	initialCounts['research'] = 0;
	return issues.reduce((acc, issue) => {
		const isOrphan = issue.resourceClass === 'research' || !issue.resourceID;
		const belongsToClass = resourceClasses.includes(issue.resourceClass);

		if (isOrphan) {
			acc['research']++;
		} else if (belongsToClass) {
			acc[issue.resourceClass]++;
		} else {
			acc['unknown']++;
		}

		return acc;
	}, initialCounts);
};

export const SelectAnyResourceModal: FC<SelectAnyResourceModalProps> = ({
	issues,
}) => {
	const navigate = useNavigate();
	const { isOpen, modalId, setIsOpen } = useModalStore();
	const [activeView, setActiveView] = useState('selector');
	const [alias, setAlias] = useState<'w' | 'm' | 'c' | 's' | 'sc' | 'n'>('w');
	const { openModal, setResourceID, setResourceType } = useReportStore(
		(state) => state,
	);
	const resourceCount = useRef<Record<string, number>>({
		web: 0,
		mobile: 0,
		cloud: 0,
		social: 0,
		source: 0,
		lan: 0,
		research: 0,
	});
	useEffect(() => {
		resourceCount.current = getIssueResourceCountV2(issues, [
			'web',
			'mobile',
			'cloud',
			'social',
			'source',
			'lan',
		]);
	}, [issues]);

	const handleChangeView = (
		view: string,
		alias: 'w' | 'm' | 'c' | 's' | 'sc' | 'n',
	) => {
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

	const handleReportForTable = (id: string, type: string) => {
		if (modalId == 'selectReport') {
			setIsOpen(false);
			setActiveView('selector');
			openModal();
			setResourceID(id);
			setResourceType(type);
		} else if (modalId == 'selectFinding') {
			navigate(`/issues/create/${type == 'network' ? 'lan' : type}/${id}`);
		}
	};
	const handleResearch = () => {
		if (modalId == 'selectFinding') {
			navigate(`/issues/create/research`);
		}
	};
	const title =
		modalId == 'selectReport'
			? 'Choose the resource class to generate the report'
			: 'Choose the resource class you want to create the issues for';
	const header =
		modalId == 'selectReport' ? 'Select report type' : 'Create new issue';

	return (
		<ModalTitleWrapper
			headerTitle={header}
			isActive={
				isOpen && (modalId == 'selectReport' || modalId == 'selectFinding')
			}
			close={handleClose}>
			<div
				className={`report-type-modal ${activeView !== 'selector' && 'type-selector-container'}`}>
				<Show when={activeView === 'selector'}>
					<h3>{title}</h3>
					<div className="report-type-container">
						<ResourceFigure
							icon={<GlobeWebIcon />}
							title="Web"
							count={resourceCount.current['web']}
							click={() => handleChangeView('web', 'w')}
							isActive={
								resourceCount.current['web'] > 0 ||
								modalId == 'selectFinding'
							}
						/>
						<ResourceFigure
							icon={<MobileIcon />}
							title="Mobile"
							count={resourceCount.current['mobile']}
							click={() => handleChangeView('mobile', 'm')}
							isActive={
								resourceCount.current['mobile'] > 0 ||
								modalId == 'selectFinding'
							}
						/>

						<ResourceFigure
							icon={<CLoudIcon />}
							title="Cloud"
							count={resourceCount.current['cloud']}
							click={() => handleChangeView('cloud', 'c')}
							isActive={
								resourceCount.current['cloud'] > 0 ||
								modalId == 'selectFinding'
							}
						/>

						<ResourceFigure
							icon={<SourceCodeIcon />}
							title="Source"
							count={resourceCount.current['source']}
							click={() => handleChangeView('source code', 'sc')}
							isActive={
								resourceCount.current['source'] > 0 ||
								modalId == 'selectFinding'
							}
						/>

						<ResourceFigure
							icon={<PeopleGroupIcon />}
							title="Social"
							count={resourceCount.current['social']}
							click={() => handleChangeView('social', 's')}
							isActive={
								resourceCount.current['social'] > 0 ||
								modalId == 'selectFinding'
							}
						/>

						<ResourceFigure
							icon={<LanIcon />}
							title="Network"
							count={resourceCount.current['lan']}
							click={() => handleChangeView('network', 'n')}
							isActive={
								resourceCount.current['lan'] > 0 ||
								modalId == 'selectFinding'
							}
						/>

						<ResourceFigure
							icon={<BugIcon />}
							title="Research"
							count={resourceCount.current['research']}
							isActive={
								resourceCount.current['research'] > 0 ||
								modalId == 'selectFinding'
							}
							click={handleResearch}
						/>
					</div>
				</Show>
				<Show
					when={
						activeView !== 'selector' &&
						activeView !== 'mobile' &&
						activeView !== 'cloud'
					}>
					<ViewResourcesTable
						scopeALias={alias}
						type={activeView}
						handleSelect={handleReportForTable}
						activeFilter={modalId !== 'selectFinding'}
						modalId={modalId}
					/>
				</Show>
				<Show when={activeView === 'mobile' || activeView === 'cloud'}>
					<ViewAppCard
						getReport={handleReportForTable}
						scopeALias={alias}
						type={activeView}
						activeFilter={modalId !== 'selectFinding'}
						modalId={modalId}
					/>
				</Show>
			</div>
		</ModalTitleWrapper>
	);
};
