import type { FC, PropsWithChildren, ReactNode } from 'react';
import {
	BugIcon,
	CLoudIcon,
	GlobeWebIcon,
	LanIcon,
	MobileIcon,
	NetworkIcon,
	PeopleGroupIcon,
	SourceCodeIcon,
} from '../..';

interface ResourceIconTextProps {
	resourceClass: string;
	name?: string;
}

export const ResourceIconText: FC<ResourceIconTextProps> = ({
	resourceClass,
	name,
}) => {
	const ResourceIcon = (props: any) => {
		if (props.resourceClass === 'web') return <GlobeWebIcon />;
		if (props.resourceClass === 'mobile') return <MobileIcon />;
		if (props.resourceClass === 'cloud') return <CLoudIcon />;
		if (props.resourceClass === 'source') return <SourceCodeIcon />;
		if (props.resourceClass === 'social') return <PeopleGroupIcon />;
		if (props.resourceClass === 'lan') return <LanIcon />;

		return <BugIcon />;
	};

	return (
		<>
			<ResourceIcon resourceClass={resourceClass} />
			{name}
		</>
	);
};
