import React from 'react';
import type {
	ResourceScopeApp,
	MobileApp,
	CloudApp,
} from '../../../../../data';
import { AppCard, EmptyCard } from '../../..';

export const MobileResourceScope: React.FC<
	ResourceScopeApp<MobileApp | CloudApp>
> = ({ isLoading, resources, type }) => {
	if (!isLoading) {
		return (
			<div className="app-card-container">
				<AppCard
					type={type}
					id={resources?.id || ''}
					appMedia={resources?.appMedia || ''}
					appDesc={resources?.appDesc || ''}
					name={resources?.appName || ''}
					appReviews={
						resources
							? 'appReviews' in resources
								? resources?.appReviews
								: ''
							: ''
					}
					appRank={
						resources
							? 'appRank' in resources
								? resources?.appRank
								: ''
							: ''
					}
					appDeveloper={
						resources
							? 'appDeveloper' in resources
								? resources?.appDeveloper
								: ''
							: ''
					}
					cloudProvider={
						resources
							? 'cloudProvider' in resources
								? resources?.cloudProvider.toLowerCase()
								: ''
							: ''
					}
				/>
			</div>
		);
	} else {
		return <EmptyCard />;
	}
};
