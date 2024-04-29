import type { Issues } from '@interfaces/index';
import { ModalTitleWrapper } from '..';
import {
	BugIcon,
	CLoudIcon,
	GlobeWebIcon,
	LanIcon,
	MobileIcon,
	PeopleGroupIcon,
	SourceCodeIcon,
} from '../..';
import './report-type.scss';
import { useRef, type FC } from 'react';
import useModalStore from '@stores/modal.store';

interface SelectReportTypeModalProps {
	issues: Issues[];
}

export const SelectReportTypeModal: FC<SelectReportTypeModalProps> = ({
	issues,
}) => {
	const { isOpen, modalId, setIsOpen } = useModalStore();
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
			const isOrphan =
				issue.resourceClass === 'research' || !issue.resourceID;
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
	const resourceCount = getIssueResourceCountV2(issues, [
		'web',
		'mobile',
		'cloud',
		'social',
		'source',
		'lan',
	]);
	console.log({ any: resourceCount });

	return (
		<ModalTitleWrapper
			headerTitle="Select report type"
			isActive={isOpen && modalId == 'selectReport'}
			close={() => setIsOpen(false)}>
			<div className="report-type-modal">
				<h3>Choose the resource class to generate the report</h3>
				<div className="report-type-container">
					<figure className="report-type-card">
						<GlobeWebIcon />

						<figcaption className={'caption-card'}>
							<h4>Web</h4>
							<h5>
								total issues <span>{resourceCount['web']}</span>
							</h5>
						</figcaption>
					</figure>

					<figure className="report-type-card">
						<MobileIcon />

						<figcaption className={'caption-card'}>
							<h4>Mobile</h4>
							<h5>
								total issues <span>{resourceCount['mobile']}</span>
							</h5>
						</figcaption>
					</figure>

					<figure className="report-type-card">
						<CLoudIcon />

						<figcaption className={'caption-card'}>
							<h4>Cloud</h4>
							<h5>
								total issues <span>{resourceCount['cloud']}</span>
							</h5>
						</figcaption>
					</figure>

					<figure className="report-type-card">
						<SourceCodeIcon />

						<figcaption className={'caption-card'}>
							<h4>Source</h4>
							<h5>
								total issues <span>{resourceCount['source']}</span>
							</h5>
						</figcaption>
					</figure>

					<figure className="report-type-card">
						<PeopleGroupIcon />

						<figcaption className={'caption-card'}>
							<h4>Social</h4>
							<h5>
								total issues <span>{resourceCount['social']}</span>
							</h5>
						</figcaption>
					</figure>

					<figure className="report-type-card">
						<LanIcon />

						<figcaption className={'caption-card'}>
							<h4>Network</h4>
							<h5>
								total issues <span>{resourceCount['lan']}</span>
							</h5>
						</figcaption>
					</figure>

					<figure className="report-type-card">
						<BugIcon />

						<figcaption className={'caption-card'}>
							<h4>Huerfano</h4>
							<h5>
								total issues <span>{resourceCount['research']}</span>
							</h5>
						</figcaption>
					</figure>
				</div>
			</div>
		</ModalTitleWrapper>
	);
};
