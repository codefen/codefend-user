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

interface SelectReportTypeModalProps {
	issues: Issues[];
}

export const SelectReportTypeModal: FC<SelectReportTypeModalProps> = ({
	issues,
}) => {
	const getIssueResourceCount = (
		issues: Issues[],
		resourceClass: string,
		acceptOrphans?: boolean,
	) => {
		return issues.reduce((acc, issue) => {
			const isTargetResource = issue.resourceClass === resourceClass;
			const isOrphan = !issue.resourceID;

			if (
				isTargetResource &&
				((!acceptOrphans && !isOrphan) || acceptOrphans)
			) {
				return acc + 1;
			} else if (resourceClass === 'any' && acceptOrphans && isOrphan) {
				return acc + 1;
			}

			return acc;
		}, 0);
	};
	const webCount = useRef(getIssueResourceCount(issues, 'web'));
	const mobileCount = useRef(getIssueResourceCount(issues, 'mobile'));
	const cloudCount = useRef(getIssueResourceCount(issues, 'cloud'));
	const socialCount = useRef(getIssueResourceCount(issues, 'social'));
	const sourceCount = useRef(getIssueResourceCount(issues, 'source'));
	const networkCount = useRef(getIssueResourceCount(issues, 'network'));
	const orphanCount = useRef(getIssueResourceCount(issues, 'any', true));
	return (
		<ModalTitleWrapper
			headerTitle="Select report type"
			isActive={false}
			close={() => {}}>
			<div className="report-type-modal">
				<h3>Choose the resource class to generate the report</h3>
				<div className="report-type-container">
					<figure className="report-type-card">
						<GlobeWebIcon />

						<figcaption className={'caption-card'}>
							<h4>Web</h4>
							<h5>
								total issues <span>{webCount.current}</span>
							</h5>
						</figcaption>
					</figure>

					<figure className="report-type-card">
						<MobileIcon />

						<figcaption className={'caption-card'}>
							<h4>Mobile</h4>
							<h5>
								total issues <span>{mobileCount.current}</span>
							</h5>
						</figcaption>
					</figure>

					<figure className="report-type-card">
						<CLoudIcon />

						<figcaption className={'caption-card'}>
							<h4>Cloud</h4>
							<h5>
								total issues <span>{cloudCount.current}</span>
							</h5>
						</figcaption>
					</figure>

					<figure className="report-type-card">
						<SourceCodeIcon />

						<figcaption className={'caption-card'}>
							<h4>Source</h4>
							<h5>
								total issues <span>{sourceCount.current}</span>
							</h5>
						</figcaption>
					</figure>

					<figure className="report-type-card">
						<PeopleGroupIcon />

						<figcaption className={'caption-card'}>
							<h4>Social</h4>
							<h5>
								total issues <span>{socialCount.current}</span>
							</h5>
						</figcaption>
					</figure>

					<figure className="report-type-card">
						<LanIcon />

						<figcaption className={'caption-card'}>
							<h4>Network</h4>
							<h5>
								total issues <span>{networkCount.current}</span>
							</h5>
						</figcaption>
					</figure>

					<figure className="report-type-card">
						<BugIcon />

						<figcaption className={'caption-card'}>
							<h4>Huerfano</h4>
							<h5>
								total issues <span>{orphanCount.current}</span>
							</h5>
						</figcaption>
					</figure>
				</div>
			</div>
		</ModalTitleWrapper>
	);
};
