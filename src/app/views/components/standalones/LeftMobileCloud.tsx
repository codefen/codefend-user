import { AppCard } from '@standalones/AppCard.tsx';
import {
	useSelectMobileCloudApp,
	type SelectMobileCloudApp,
} from '@stores/mobileCloudApp.store';
import { useCallback, useEffect, useState, type FC } from 'react';

interface LeftMobileCloudProps {
	resources: any[];
	openModal: () => void;
	type: string;
}

export const ListResourceWithSearch: FC<LeftMobileCloudProps> = ({
	resources,
	openModal,
	type,
}) => {
	const [term, setTerm] = useState('');
	const { isNotNull, appSelected, isCurrentSelected, updateSelected } =
		useSelectMobileCloudApp((state: SelectMobileCloudApp) => state);

	const selectResource = (resource: any) => {
		if (isNotNull() && isCurrentSelected(resource.id)) return;

		updateSelected(resource);
	};
	useEffect(() => {
		if (appSelected === null) {
			updateSelected(resources[0]);
		}
	}, [appSelected]);

	const getResourcesFiltered = useCallback(
		() =>
			resources.filter((app) =>
				app.appName.toLowerCase().includes(term.toLowerCase()),
			),
		[term],
	);
	return (
		<div className={'card cloud-apps'}>
			<div className="over">
				<div className="header">
					<div className="title">
						<span>{type} Applications</span>
					</div>
					<div className="actions">
						<div onClick={openModal}>Add {type} app</div>
					</div>
				</div>
				<input
					type="text"
					className="log-inputs search-app"
					placeholder="search"
					onChange={(e: any) => setTerm(e.target.value)}
				/>
				<div className="list">
					{getResourcesFiltered().map((resource, i) => (
						<div
							key={`${resource.id}-${i}`}
							className="app-info"
							onClick={(e: React.FormEvent) => {
								e.preventDefault();
								selectResource(resource);
							}}>
							<AppCard
								isActive={isCurrentSelected(resource.id)}
								id={resource.id}
								type={type.toLowerCase()}
								name={resource.appName}
								appMedia={type == 'Mobile' ? resource.appMedia : ''}
								appDesc={resource.appDesc}
								appReviews={resource?.appReviews || undefined}
								appRank={resource?.appRank || undefined}
								appDeveloper={resource?.appDeveloper || undefined}
								cloudProvider={
									resource?.cloudProvider
										? resource.cloudProvider.toLowerCase()
										: undefined
								}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
