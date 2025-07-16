import { type FC, type MouseEvent } from 'react';
import { useNavigate } from 'react-router';
import '../socialEngineering.scss';
import { LinkedinV2Icon } from '@/app/views/components/icons/LinkedinV2Icon';
import type { MemberV2 } from '@interfaces/panel';
import SocialSkeleton from './SocialSkeleton';

interface SocialEngineeringProps {
  paginatedMembers: MemberV2[];
  sentryRef: (node?: Element | null | undefined) => void;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
}

const SocialEngineering: FC<SocialEngineeringProps> = ({ 
  paginatedMembers, 
  sentryRef,
  isLoading = false,
  isLoadingMore = false,
  hasMore = false
}) => {
  const navigate = useNavigate();

  const handleMemberClick = (email: string, event: MouseEvent) => {
    // Prevent navigation if clicking on LinkedIn link
    if ((event.target as HTMLElement).closest('a')) {
      return;
    }

    // Navigate to SNS with search parameters
    navigate(`/sns?keyword=${encodeURIComponent(email)}&class=email`);
  };

  // Show skeleton when loading initially
  if (isLoading && paginatedMembers.length === 0) {
    return <SocialSkeleton count={8} />;
  }

  return (
    <div className="social-grid">
      {paginatedMembers.map((member, index) => (
        <div
          key={member.id}
          ref={paginatedMembers.length === index + 1 ? sentryRef : undefined}
          className={`social-card ${member.linkedin_url ? 'has-linkedin' : ''}`}
          onClick={e => handleMemberClick(member.email, e)}
          style={{ cursor: 'pointer' }}>
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
                <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer">
                  <LinkedinV2Icon />
                </a>
              </>
            )}
          </div>
        </div>
      ))}
      
      {/* Show skeleton when loading more content */}
      {hasMore && isLoadingMore && <SocialSkeleton count={4} />}
      
      {/* Show message only when no more elements and not loading */}
      {!hasMore && !isLoading && paginatedMembers.length > 0 && (
        <div className="loading-message">All elements are listed.</div>
      )}
    </div>
  );
};

export default SocialEngineering;
