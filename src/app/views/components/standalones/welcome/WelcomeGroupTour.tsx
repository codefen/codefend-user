import { WelcomeGuide } from './WelcomeGuide.tsx';
import { WelcomeModal } from './WelcomeModal.tsx';
import WelcomeLoadResource from './WelcomeLoadResource.tsx';
import useModalStore from '@stores/modal.store.ts';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts.ts';

export const WelcomeGroupTour = () => {
	const { isOpen, modalId, setIsOpen, setModalId } = useModalStore();

	const startLoadResource = () => {
		setIsOpen(true);
		setModalId(MODAL_KEY_OPEN.USER_SELECT_RESOURCE);
	};
	const startGuide = () => {
		setIsOpen(true);
		setModalId(MODAL_KEY_OPEN.USER_GUIDE);
	};

	const closeGuide = () => {
		setIsOpen(false);
		setModalId('');
	};
	const closeModal = () => {
		startLoadResource();
		setModalId('');
	};
	const closeFirstRes = () => {
		setIsOpen(false);
		setModalId('');
	};
	/* else if (openGuide) {
		return (
			<WelcomeGuide defaultOpenValue={openGuide} closeGuide={closeGuide} />
		);
	} */

	if (isOpen && modalId === MODAL_KEY_OPEN.USER_WELCOME) {
		return (
			<WelcomeModal
				closeModal={closeModal}
				startGuide={startGuide}
				startLoadResource={startLoadResource}
			/>
		);
	} else if (isOpen && modalId === MODAL_KEY_OPEN.USER_SELECT_RESOURCE) {
		return <WelcomeLoadResource close={closeFirstRes} />;
	}
	return null;
};
