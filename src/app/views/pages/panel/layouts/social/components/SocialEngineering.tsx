import {
	BugIcon,
	ConfirmModal,
	CredentialIcon,
	ModalTitleWrapper,
	PeopleGroupIcon,
	TableV2,
	TrashIcon,
} from '../../../../../../views/components';

import {
	type MemberV2,
	type TableItem,
	memberColumnWithActions,
	roleMap,
	useModal,
	memberColumn,
} from '../../../../../../data';
import AddSocialModal from '../../../../../components/modals/adding-modals/AddSocialModal';
import { useNavigate } from 'react-router';
import { type FC } from 'react';
import { useAddSocial } from '@resourcesHooks/social/useDeleteSocial';
import { useUserRole } from '#commonUserHooks/useUserRole';
import useCredentialStore from '@stores/credential.store';
import useModalStore from '@stores/modal.store';

interface SocialProps {
	refetch: () => void;
	isLoading: boolean;
	socials: MemberV2[];
}

const SocialEngineering: FC<SocialProps> = (props) => {
	const navigate = useNavigate();
	const { showModal, setShowModal, setShowModalStr, showModalStr } =
		useModal();
	const [handleDeleteResource, { setSelectedId, isLoading }] = useAddSocial(
		() => {
			setShowModal(false);
			props.refetch();
		},
	);

	const { isAdmin, isNormalUser, isProvider } = useUserRole();
	const { setCrendentialType, setResourceId } = useCredentialStore();
	const { setIsOpen, setModalId } = useModalStore();

	const safelyPreviousSearches = () => props.socials.slice().reverse();

	const dataTable = safelyPreviousSearches().map(
		(member: MemberV2) =>
			({
				ID: { value: member.id, style: 'id' },
				fullName: {
					value: member.member_fname + ' ' + member.member_lname,
					style: 'full-name',
				},
				email: { value: member.member_email, style: 'email' },
				phone: { value: member.member_phone, style: 'phone' },
				role: {
					value: roleMap[member.member_role as keyof typeof roleMap],
					style: 'role',
				},
			}) as Record<string, TableItem>,
	);

	const tableAction = {
		icon: [] as any,
	};

	if (isProvider() || isAdmin()) {
		tableAction.icon.push({
			action: (id: string, type?: any) =>
				navigate(`/issues/create/social/${id}`),
			render: <BugIcon isButton />,
		});
	}
	tableAction.icon.push({
		action: (id: string) => {
			setResourceId(id);
			setCrendentialType('social');
			setIsOpen(true);
			setModalId('social');
		},
		render: <CredentialIcon />,
		style: '',
	});
	if (isAdmin() || isNormalUser()) {
		tableAction.icon.push({
			action: (id: string, type?: any) => {
				setShowModalStr('delete');
				setShowModal(true);
				setSelectedId(id);
			},
			render: <TrashIcon />,
		});
	}

	return (
		<>
			<ModalTitleWrapper
				isActive={showModal && showModalStr === 'add_member'}
				close={() => setShowModal(false)}
				headerTitle="Add a new member">
				<AddSocialModal
					onDone={() => {
						setShowModal(false);
						props.refetch();
					}}
					close={() => setShowModal(false)}
				/>
			</ModalTitleWrapper>
			<ModalTitleWrapper
				isActive={showModal && showModalStr === 'delete'}
				close={() => setShowModal(false)}
				headerTitle="Delete social engineering">
				<ConfirmModal
					action={() => {
						handleDeleteResource();
					}}
					header=""
					cancelText="Cancel"
					confirmText="Delete"
					close={() => setShowModal(false)}
				/>
			</ModalTitleWrapper>

			<div className="card table">
				<div className="header">
					<div className="title">
						<div className="icon">
							<PeopleGroupIcon />
						</div>
						<span>Social Engineering</span>
					</div>
					<div className="actions">
						<div
							onClick={() => {
								setShowModal(!showModal);
								setShowModalStr('add_member');
							}}>
							Add profile
						</div>
					</div>
				</div>
				<TableV2
					columns={memberColumnWithActions}
					rowsData={dataTable}
					tableAction={tableAction}
					showRows={!props.isLoading}
					showEmpty={!props.isLoading && !Boolean(dataTable.length)}
				/>
			</div>
		</>
	);
};

export default SocialEngineering;
