import React, { Dispatch, SetStateAction } from 'react';
import {
	ChartIcon,
	PeopleGroup,
	Show,
	SimpleSection,
} from '../../../../../components';
import { MemberV2, MetricsService, roleMap } from '../../../../../../data';

interface SocialEngineeringMembersProps {
	isLoading: boolean;
	members: MemberV2[];
	handleDepartmentFilter: (role: string) => void;
}

const SocialEngineeringMembers: React.FC<SocialEngineeringMembersProps> = ({
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
									<input
										type="checkbox"
										onChange={(e) => handleDepartmentFilter(role)}
										className=""
									/>
									<label>
										{roleMap[role as keyof typeof roleMap] ??
											'Unknown role'}
									</label>
								</div>
								<div className="value">
									<span className="text-blue-400">
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
