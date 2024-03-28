import type { FC } from 'react';
import { AboutProvider } from './AboutProvider';

export interface ActiveProviderPanelProps {
	activeOptions: number;
}

export const ActiveProviderPanel: FC<ActiveProviderPanelProps> = ({
	activeOptions,
}) => {
	if (activeOptions == 0) {
		return <AboutProvider />;
	}

	return undefined;
};
