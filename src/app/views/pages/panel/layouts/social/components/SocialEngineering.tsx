import {
	EmptyCard,
	ModalTitleWrapper,
	PageLoader,
	PeopleGroup,
	Show,
	TableItem,
	TableV2,
} from '../../../../../../views/components';

import {
	MemberV2,
	SuperMember,
	collaboratorsColumns,
	roleMap,
	useModal,
} from '../../../../../../data';
import AddSocialModal from '../../../../../components/modals/AddSocialModal';
import { useNavigate } from 'react-router';

interface SocialProps {
	refetch: () => void;
	isLoading: boolean;
	socials: MemberV2[];
}

const SocialEngineering: React.FC<SocialProps> = (props) => {
	const { showModal, setShowModal, setShowModalStr, showModalStr } =
		useModal();
	const navigate = useNavigate();
	const safelyPreviousSearches = () =>
		Array.isArray(props.socials) ? props.socials.slice().reverse() : [];

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

			<div className="card table flex-grow">
				<div className="header">
					<div className="title">
						<div className="icon">
							<PeopleGroup />
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
						<div
							onClick={() => {
								const firstMemberId = safelyPreviousSearches()[0]?.id;
								firstMemberId
									? navigate(`/issues/create/social/${firstMemberId}`)
									: navigate('/issues/create');
							}}>
							Add issues
						</div>
					</div>
				</div>
				<TableV2
					columns={collaboratorsColumns}
					rowsData={dataTable}
					showRows={!props.isLoading}
					showEmpty={!props.isLoading && dataTable.length === 0}
					sizeY={95}
				/>
			</div>
		</>
	);
};

export default SocialEngineering;
