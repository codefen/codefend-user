import { useCallback, useMemo } from 'react';
import { CloudService, MobileService, useAuthState, useModal } from '..';
import { toast } from 'react-toastify';

interface HookProps {
	type?: string;
	name: string;
	isMainNetwork?: string | boolean;
	showDetails?: boolean;
	appMedia: string;
}

export const useAppCard = (props: HookProps) => {
	const { getUserdata, getCompany } = useAuthState();

	const isDetails = useMemo(
		() => Boolean(props.showDetails),
		[props.showDetails],
	);
	const isMobileType = useMemo(() => props.type === 'mobile', [props.type]);
	const isImage = useMemo(
		() => props.appMedia.trim() && props.appMedia !== undefined,
		[props.appMedia],
	);

	const { showModal, setShowModal, showModalStr, setShowModalStr } =
		useModal();

	const handleDelete = useCallback(
		(id: string) => {
			const action = isMobileType ? MobileService : CloudService;

			return action
				.deleteApp(id, getCompany())
				.then(() => {
					toast.success(
						`successfully deleted ${
							isMobileType ? 'mobile app' : 'cloud'
						} `,
					);
				})
				.catch(() => {
					toast.error('An unexpected error has occurred on the server');
				})
				.finally(() => {
					viewModal(false);
				});
		},
		[isMobileType],
	);

	const viewModal = useCallback((state: boolean) => {
		setShowModal(state);
		setShowModalStr('delete_confirmation');
	}, []);

	return {
		showModal,
		showModalStr,
		viewModal,
		isMobileType,
		isImage,
		isDetails,
		handleDelete,
	};
};
