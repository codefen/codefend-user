import React from 'react';
import { ChartIcon, SimpleSection } from '../../../../../components';

export const WebApplicationCredentials: React.FC = () => {
	return (
		<div className="card stats">
			<SimpleSection header="Credentials statics" icon={<ChartIcon />}>
				<div className="content">
					<div className="stat">
						<div className="value">0</div>
						<p>Admin credentials</p>
					</div>
					<div className="stat">
						<div className="value">0</div>
						<p>User credentials</p>
					</div>
				</div>
			</SimpleSection>
		</div>
	);
};
