import { useParams } from 'react-router';
import {
	cleanHTML,
	useProviderProfile,
	useProviderSidebar,
} from '../../../../../../../data';
import './aboutprovider.scss';
import { useEffect } from 'react';

export const ProfileProviderLayout = () => {
	const { view } = useParams();
	const { activeSubOption, setActiveSubOption } = useProviderSidebar();
	const { providerProfile } = useProviderProfile();

	useEffect(() => {
		if (view) {
			if (view.startsWith('about')) {
				setActiveSubOption(0);
			}
			if (view.startsWith('order')) {
				setActiveSubOption(1);
			}
		}
	}, []);

	if (activeSubOption === 0) {
		return (
			<div className="provider-about">
				<div className="about-header">
					<h2>About me:</h2>
				</div>

				<div
					className="about-provider"
					dangerouslySetInnerHTML={{
						__html: cleanHTML(providerProfile?.main_desc),
					}}></div>
			</div>
		);
	}

	return undefined;
};
