import { type FC, useEffect } from 'react';
import { useParams } from 'react-router';
import { useProviderSidebar } from '@userHooks/providers/useProviderSidebar.ts';
import { NewOrderProvider } from './NewOrderProvider.tsx';
import { CurrentOrderProvider } from './CurrentOrderProvider.tsx';

export const OrdersReviewProviders: FC = () => {
	const { view } = useParams();
	const { activeSubOption, setActiveSubOption } = useProviderSidebar();

	useEffect(() => {
		if (view) {
			if (view.startsWith('new')) {
				setActiveSubOption(0);
			}
			if (view.startsWith('current')) {
				setActiveSubOption(1);
			}
			if (view.startsWith('finish')) {
				setActiveSubOption(2);
			}
		}
	}, []);

	if (activeSubOption === 0) {
		return <NewOrderProvider />;
	}
	if (activeSubOption == 1) {
		return <CurrentOrderProvider />;
	}

	return undefined;
};
