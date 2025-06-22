import { type FC } from 'react';
import '../socialEngineering.scss';
import { LinkedinV2Icon } from '@/app/views/components/icons/LinkedinV2Icon';
import type { MemberV2 } from '@interfaces/panel';

interface SocialEngineeringProps {
	paginatedMembers: MemberV2[];
	sentryRef: (node?: Element | null | undefined) => void;
}

const SocialEngineering: FC<SocialEngineeringProps> = ({
	paginatedMembers,
	sentryRef,
}) => {
	const isLoading = !paginatedMembers || paginatedMembers.length === 0;

	return (
		<div className="card">
			<div className="social-grid">
				{!isLoading &&
					paginatedMembers.map((member, index) => (
						<div
							key={member.id}
							ref={
								paginatedMembers.length === index + 1 ? sentryRef : undefined
							}
							className={`social-card ${
								member.linkedin_url ? 'has-linkedin' : ''
							}`}>
							<div className="social-card-info">
								<span>{member.id}</span>
								<span className="separator">|</span>
								<span>{member.email}</span>
								{member.name && (
									<>
										<span className="separator">|</span>
										<span>{member.name}</span>
									</>
								)}
								{member.linkedin_url && (
									<>
										<span className="separator">|</span>
										<a
											href={member.linkedin_url}
											target="_blank"
											rel="noopener noreferrer">
											<LinkedinV2Icon />
										</a>
									</>
								)}
							</div>
						</div>
					))}
			</div>
		</div>
	);
};

export default SocialEngineering;
