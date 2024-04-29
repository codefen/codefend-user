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
import { ViewResourcesTable } from './components/ViewResourcesTable';
import { useReportStore } from '@stores/report.store';

interface SelectReportTypeModalProps {
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

export const SelectReportTypeModal: FC<SelectReportTypeModalProps> = ({
	issues,
}) => {
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
		setIsOpen(false);
		setActiveView('selector');
		openModal();
		setResourceID(id);
		setResourceType(type);
	};

	return (
		<ModalTitleWrapper
			headerTitle="Select report type"
			isActive={isOpen && modalId == 'selectReport'}
			close={handleClose}>
			<div
				className={`report-type-modal ${activeView !== 'selector' && 'type-selector-container'}`}>
				<Show when={activeView === 'selector'}>
					<h3>Choose the resource class to generate the report</h3>
					<div className="report-type-container">
						<ResourceFigure
							icon={<GlobeWebIcon />}
							title="Web"
							count={resourceCount.current['web']}
							click={() => handleChangeView('web', 'w')}
							isActive={resourceCount.current['web'] > 0}
						/>
						<ResourceFigure
							icon={<MobileIcon />}
							title="Mobile"
							count={resourceCount.current['mobile']}
							click={() => handleChangeView('mobile', 'm')}
							isActive={resourceCount.current['mobile'] > 0}
						/>

						<ResourceFigure
							icon={<CLoudIcon />}
							title="Cloud"
							count={resourceCount.current['cloud']}
							click={() => handleChangeView('cloud', 'c')}
							isActive={resourceCount.current['cloud'] > 0}
						/>

						<ResourceFigure
							icon={<SourceCodeIcon />}
							title="Source"
							count={resourceCount.current['source']}
							click={() => handleChangeView('source code', 'sc')}
							isActive={resourceCount.current['source'] > 0}
						/>

						<ResourceFigure
							icon={<PeopleGroupIcon />}
							title="Social"
							count={resourceCount.current['social']}
							click={() => handleChangeView('social', 's')}
						/>

						<ResourceFigure
							icon={<LanIcon />}
							title="Network"
							count={resourceCount.current['lan']}
							click={() => handleChangeView('network', 'n')}
							isActive={resourceCount.current['lan'] > 0}
						/>

						<ResourceFigure
							icon={<BugIcon />}
							title="Research"
							count={resourceCount.current['research']}
							isActive={resourceCount.current['research'] > 0}
						/>
					</div>
				</Show>
				<Show when={activeView !== 'selector'}>
					<ViewResourcesTable
						scopeALias={alias}
						type={activeView}
						getReport={handleReportForTable}
					/>
				</Show>
			</div>
		</ModalTitleWrapper>
	);
};
