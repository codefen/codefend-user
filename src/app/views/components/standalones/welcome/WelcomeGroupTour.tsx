import { WelcomeGuide } from './WelcomeGuide.tsx';
import { WelcomeModal } from './WelcomeModal.tsx';
import WelcomeLoadResource from './WelcomeLoadResource.tsx';
import useModalStore from '@stores/modal.store.ts';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts.ts';
import { WelcomeNexusModal } from './WelcomeNexusModal.tsx';

export const WelcomeGroupTour = () => {
	const { isOpen, modalId, setIsOpen, setModalId } = useModalStore();

	const startLoadResource = () => {
		setIsOpen(true);
		setModalId(MODAL_KEY_OPEN.USER_SELECT_RESOURCE);
	};
	const startNexusWelcome = () => {
		setIsOpen(true);
		setModalId(MODAL_KEY_OPEN.USER_NEXUS_WELCOME);
	};
	const startGuide = () => {
		setIsOpen(true);
		setModalId(MODAL_KEY_OPEN.USER_GUIDE);
	};

	const close = () => {
		setIsOpen(false);
		setModalId('');
	};

	/* else if (openGuide) {
		return (
			<WelcomeGuide defaultOpenValue={openGuide} closeGuide={closeGuide} />
		);
	} */

	if (isOpen && modalId === MODAL_KEY_OPEN.USER_WELCOME) {
		return <WelcomeModal close={close} startNext={startNexusWelcome} />;
	} else if (isOpen && modalId === MODAL_KEY_OPEN.USER_NEXUS_WELCOME) {
		return <WelcomeNexusModal close={close} startNext={startLoadResource} />;
	} else if (isOpen && modalId === MODAL_KEY_OPEN.USER_SELECT_RESOURCE) {
		return <WelcomeLoadResource close={close} />;
	}
	return null;
};
