import { useEffect, useRef, useState, type FC } from 'react';
import { useGetResources } from '@resourcesHooks/useGetResources';
import { AppCard } from '../..';

export interface ViewAppCardProps {
	type: string;
	scopeALias: 'w' | 'm' | 'c' | 's' | 'sc' | 'n';
	getReport: (id: string, type: string) => void;
	activeFilter: boolean;
	modalId: string;
}
const getPath = (alias: string) => {
	if (alias == 'm') return 'mobile';
	return 'cloud';
};
export const ViewAppCard: FC<ViewAppCardProps> = ({
	type,
	scopeALias,
	getReport,
	activeFilter,
	modalId,
}) => {
	const { getAnyResource } = useGetResources();
	const [isLoading, setLoading] = useState<boolean>(false);
	const apps = useRef<any[]>([]);

	useEffect(() => {
		setLoading(true);

		getAnyResource(getPath(scopeALias))
			.then((resources) => {
				let filterResult = resources;
				apps.current = filterResult;
			})
			.finally(() => setLoading(false));
		return () => {
			apps.current = [];
		};
	}, [scopeALias]);
	const title =
		modalId == 'selectReport'
			? `Select your ${type} resource to generate report`
			: `Select your ${type} resource to create issue`;
	return (
		<div className="card">
			<h3>{title}</h3>
			<div className="list">
				{apps.current && !isLoading
					? apps.current.map((resource, i) => (
							<div
								key={`${resource.id}-${i}`}
								className="app-info"
								onClick={(e: React.FormEvent) => {
									e.preventDefault();
									getReport(resource.id, type);
								}}>
								<AppCard
									id={resource.id}
									type={type}
									name={
										resource?.app_name || resource?.cloud_name || ''
									}
									appDesc={
										resource?.app_desc || resource?.cloud_desc || ''
									}
									appMedia={
										type == 'mobile' ? resource?.app_media : ''
									}
									appReviews={resource?.app_reviews || undefined}
									appRank={resource?.app_rank || undefined}
									appDeveloper={resource?.app_developer || undefined}
									cloudProvider={resource?.cloud_provider || undefined}
								/>
							</div>
						))
					: null}
			</div>
		</div>
	);
};
