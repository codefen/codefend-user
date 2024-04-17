import React from 'react';
import { ChartIcon, SimpleSection } from '../../../../../components';
import { StatAsset } from '@standalones/stat-asset/StatAsset.tsx';

export const WebApplicationCredentials: React.FC = () => {
	return (
		<div className="card stats">
			<SimpleSection header="Credentials statics" icon={<ChartIcon />}>
				<div className="content">
					<StatAsset value="0" valueTitle="Admin credentials" />
					<StatAsset value="0" valueTitle="User credentials" />
				</div>
			</SimpleSection>
		</div>
	);
};
