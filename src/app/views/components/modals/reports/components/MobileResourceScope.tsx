import React from 'react';
import { ResourceScope, MobileApp, CloudApp } from '../../../../../data';
import { AppCard, EmptyCard } from '../../..';

export const MobileResourceScope: React.FC<
	ResourceScope<MobileApp | CloudApp>
> = ({ isLoading, resources }) => {
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
					appReviews={
						'appReviews' in resources ? resources.appReviews : ''
					}
					appRank={'appRank' in resources ? resources.appRank : ''}
					appDeveloper={
						'appDeveloper' in resources ? resources.appDeveloper : ''
					}
					cloudProvider={
						'cloudProvider' in resources
							? resources.cloudProvider.toLowerCase()
							: ''
					}
				/>
			</div>
		);
	} else {
		return <EmptyCard />;
	}
};
