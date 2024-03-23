import { type FC, type Dispatch, type SetStateAction } from 'react';
import {
	ChartIcon,
	PeopleGroup,
	SimpleSection,
} from '../../../../../components';
import { type MemberV2, MetricsService, roleMap } from '../../../../../../data';

interface SocialEngineeringMembersProps {
	isLoading: boolean;
	members: MemberV2[];
	handleDepartmentFilter: (role: string) => void;
}

const SocialEngineeringMembers: FC<SocialEngineeringMembersProps> = ({
	members,
	handleDepartmentFilter,
}) => {
	const computedRoles = MetricsService.computeMemberRolesCount(members!);

	return (
		<>
			<div className="card filtered">
				<SimpleSection header="Members by departments" icon={<ChartIcon />}>
					<div className="content filters">
						{Object.keys(computedRoles).map((role) => (
							<div className="filter" key={role}>
								<div className="check">
									<label className="label">
										<input
											type="checkbox"
											onChange={(e) => handleDepartmentFilter(role)}
											className="codefend-checkbox"
										/>
										{roleMap[role as keyof typeof roleMap] ??
											'Unknown role'}
									</label>
								</div>
								<div className="value">
									<span className="icon-color">
										<PeopleGroup />
									</span>
									<span>
										{
											computedRoles[
												role as keyof typeof computedRoles
											]
										}{' '}
										members
									</span>
								</div>
							</div>
						))}
					</div>
				</SimpleSection>
			</div>
		</>
	);
};

export default SocialEngineeringMembers;
