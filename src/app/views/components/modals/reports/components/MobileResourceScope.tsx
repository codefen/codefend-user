import React from 'react';
import { ResourceScope, MobileApp } from '../../../../../data';
import { AppCard, EmptyCard } from '../../..';

export const MobileResourceScope: React.FC<ResourceScope<MobileApp>> = ({
	isLoading,
	resources,
}) => {
	console.log({ resources });
	if (!isLoading) {
		return (
			<div className="app-card-container">
				<AppCard
					type="mobile"
					id={resources.id || ''}
					appMedia={resources.appMedia || ''}
					appDesc={resources.appDesc || ''}
					name={resources.appName || ''}
					appReviews={resources.appReviews || ''}
					appRank={resources.appRank || ''}
					appDeveloper={resources.appDeveloper || ''}
				/>
			</div>
		);
	} else {
		return <EmptyCard />;
	}
};
