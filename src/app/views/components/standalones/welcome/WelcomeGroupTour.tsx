import { useReadLocalStorage } from 'usehooks-ts';
import { WelcomeGuide } from './WelcomeGuide.tsx';
import { WelcomeModal } from './WelcomeModal.tsx';
import { useWelcomeUser } from '@panelHooks/userWelcomeUser.ts';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';

export const WelcomeGroupTour = () => {
	const { isProvider, isReseller } = useUserRole();
	const initialValue = useReadLocalStorage<boolean>('openWelcomeModal');
	const isOpen = isProvider() || isReseller() ? false : initialValue || true;
	const [openModal, openGuide, setOpenGuide, setOpenModal] =
		useWelcomeUser(isOpen);

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
