import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChartIcon, SimpleSection } from '..';

import { IssuesCondition } from '../../../data';

export const VulnerabilitiesStatus: React.FC<{
	vulnerabilityByShare: IssuesCondition;
}> = (props) => {
	const renderMetrics = () => {
		return {
			total: props.vulnerabilityByShare.total ?? 0,
			fixed: props.vulnerabilityByShare.fixed ?? 0,
			open: props.vulnerabilityByShare.open ?? 0,
		};
	};
	const navigate = useNavigate();

	return (
		<div className="card stats">
			<SimpleSection header="Vulnerabilities by status" icon={<ChartIcon />}>
				<div
					onClick={() => {
						navigate('/issues');
					}}
					className="content">
					<div className="stat">
						<div className="value">
							<span className="text-fend-red">
								{renderMetrics().open}
							</span>
							{`/${renderMetrics().total}`}
						</div>
						<p className="text-fend-red">Open issues</p>
					</div>
					<div className="stat">
						<div className="value">
							<span>{renderMetrics().fixed}</span>
							{`/${renderMetrics().total}`}
						</div>
						<p>Fixed issues</p>
					</div>
					<div className="stat">
						<div className="value">{renderMetrics().total}</div>
						<p>Total issues</p>
					</div>
				</div>
			</SimpleSection>
		</div>
	);
};
