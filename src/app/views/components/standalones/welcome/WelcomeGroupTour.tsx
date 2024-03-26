import { WelcomeGuide } from './WelcomeGuide';
import { WelcomeModal } from './WelcomeModal';
import { useAuthState, useWelcomeUser } from '../../../../data';
import { useEffect } from 'react';
import { useReadLocalStorage } from 'usehooks-ts';

export const WelcomeGroupTour = () => {
	const initialValue = useReadLocalStorage<boolean>('openWelcomeModal');
	const [openModal, openGuide, setOpenGuide, setOpenModal] = useWelcomeUser(
		initialValue || true,
	);
	const { getUserdata } = useAuthState();

	const closeGuide = () => {
		setOpenGuide(false);
	};

	const closeModal = () => {
		setOpenModal(false);
	};

	const startGuide = () => {
		setOpenModal(false);
		setOpenGuide(true);
	};

	if (openModal) {
		return (
			<WelcomeModal
				defaultOpenValue={openModal}
				closeModal={closeModal}
				startGuide={startGuide}
			/>
		);
	} else if (openGuide) {
		return (
			<WelcomeGuide defaultOpenValue={openGuide} closeGuide={closeGuide} />
		);
	}
	return null;
};
