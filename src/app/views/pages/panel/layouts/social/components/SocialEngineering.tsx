import {
	BugIcon,
	ConfirmModal,
	ModalTitleWrapper,
	PeopleGroupIcon,
	TableV2,
	TrashIcon,
} from '../../../../../../views/components';

import {
	type MemberV2,
	type TableItem,
	collaboratorsColumns,
	roleMap,
	useModal,
} from '../../../../../../data';
import AddSocialModal from '../../../../../components/modals/adding-modals/AddSocialModal';
import { useNavigate } from 'react-router';
import { type FC } from 'react';
import { useAddSocial } from '@resourcesHooks/social/useDeleteSocial';

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
		() => setShowModal(false),
	);

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
		icon: [
			{
				action: (id: string, type?: any) =>
					navigate(`/issues/create/social/${id}`),
				render: <BugIcon />,
			},
			{
				action: (id: string, type?: any) => {
					setShowModalStr('delete');
					setShowModal(true);
					setSelectedId(id);
				},
				render: <TrashIcon />,
			},
		],
	};

	return (
		<>
			<ModalTitleWrapper
				isActive={showModal && showModalStr === 'add_member'}
				close={() => setShowModal(false)}
				headerTitle="Add a new member">
				<AddSocialModal
					onDone={() => {
						props.refetch();
						setShowModal(false);
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
					columns={collaboratorsColumns}
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
