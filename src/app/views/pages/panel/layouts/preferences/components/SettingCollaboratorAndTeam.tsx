import { EmptyCard, PageLoader, Show } from '../../../../../components';
import { type Member } from '../../../../../../data';
import { type FC } from 'react';

interface CollaboratorDataProps {
	isLoading: boolean;
	members: Member[];
}

const SettingCollaboratorAndTeam: FC<CollaboratorDataProps> = (props) => {
	return (
		<>
			<div className="card table">
				<div className="header">
					<div className="title">
						<div className="icon">{/* <HiSolidUserGroup /> */}</div>
						<span>COLLABORATORS AND TEAM MEMBERS</span>
					</div>
					<div className="actions">
						<div>ADD NEW MEMBER</div>
					</div>
				</div>

				<div className="columns-name">
					<div className="id">id</div>
					<div className="full-name">full name</div>
					<div className="email">email</div>
					<div className="phone">phone</div>
					<div className="role">role</div>
				</div>

				<div className="rows">
					<Show when={!props.isLoading} fallback={<PageLoader />}>
						<>
							{props.members.map((member: Member) => (
								<div key={member.id} className="item">
									<div className="id">{member.id}</div>
									<div className="full-name">{`${member.fname} ${member.lname}`}</div>
									<div className="email">{member.email}</div>
									<div className="phone">
										<Show when={!member.eliminado} fallback={<>-</>}>
											<>+${member.phone}</>
										</Show>
									</div>
									<div className="role">{member.role}</div>
								</div>
							))}
						</>
					</Show>
				</div>
			</div>
			<Show when={!props.isLoading && !Boolean(props.members.length)}>
				<EmptyCard />
			</Show>
		</>
	);
};

export default SettingCollaboratorAndTeam;
