import { type FC, type MouseEvent } from 'react';
import { useNavigate } from 'react-router';
import type { MemberV2 } from '@interfaces/panel';
import { LinkedinV2Icon, EmailIcon } from '@icons';
import LinkedInSkeleton from './LinkedInSkeleton';
import '../socialEngineering.scss';

interface LinkedInProfilesViewProps {
  members: MemberV2[];
  sentryRef: (node?: Element | null | undefined) => void;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
}

const LinkedInProfilesView: FC<LinkedInProfilesViewProps> = ({ 
  members, 
  sentryRef,
  isLoading = false,
  isLoadingMore = false,
  hasMore = false
}) => {
  const navigate = useNavigate();
  
  // Filter only members with LinkedIn
  const linkedInMembers = members.filter(member => member.linkedin_url);
  
  const handleMemberClick = (email: string, event: MouseEvent) => {
    // Prevent navigation if clicking on LinkedIn link
    if ((event.target as HTMLElement).closest('a')) {
      return;
    }

    // Navigate to SNS with search parameters
    navigate(`/sns?keyword=${encodeURIComponent(email)}&class=email`);
  };

  // Show skeleton when loading initially
  if (isLoading && linkedInMembers.length === 0) {
    return <LinkedInSkeleton count={6} />;
  }

  if (linkedInMembers.length === 0) {
    return (
      <div className="card">
        <div className="no-results-found">
          <p>No LinkedIn profiles found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="linkedin-profiles-grid">
        {linkedInMembers.map((member, index) => (
          <div
            key={member.id}
            ref={linkedInMembers.length === index + 1 ? sentryRef : undefined}
            className="linkedin-profile-card"
            onClick={e => handleMemberClick(member.email, e)}>
            
            {/* Image on the left */}
            <div className="linkedin-profile-image">
              {/* Using placeholder for now, can be replaced with member.linkedin_profile when available */}
              <img 
                src="/util/default-profilemedia.webp" 
                alt={`${member.name || member.email} profile`}
                onError={(e) => {
                  // Fallback if image doesn't load
                  (e.target as HTMLImageElement).src = '/util/default-profilemedia.webp';
                }}
              />
            </div>

            {/* Information on the right */}
            <div className="linkedin-profile-info">
              <div className="linkedin-profile-name">
                <h4>{member.name || 'Name not available'}</h4>
              </div>
              <div className="linkedin-profile-url">
                <a 
                  href={member.linkedin_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}>
                  <LinkedinV2Icon width="16" height="16" />
                  <span>{member.linkedin_url}</span>
                </a>
              </div>
              {member.email && (
                <div className="linkedin-profile-email">
                  <EmailIcon width="16" height="16" />
                  <span>{member.email}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Show skeleton when loading more content */}
        {hasMore && isLoadingMore && 
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="linkedin-profile-card skeleton-linkedin-card"
              style={{ minHeight: '100px' }}
            >
              <div className="linkedin-profile-image">
                <div className="skeleton-profile-image"></div>
              </div>
              <div className="linkedin-profile-info">
                <div className="linkedin-profile-name">
                  <div className="skeleton-text skeleton-name-text"></div>
                </div>
                <div className="linkedin-profile-url">
                  <div className="skeleton-linkedin-icon">
                    <LinkedinV2Icon width="16" height="16" />
                  </div>
                  <div className="skeleton-text skeleton-url-text"></div>
                </div>
                <div className="linkedin-profile-email">
                  <div className="skeleton-email-icon">
                    <EmailIcon width="16" height="16" />
                  </div>
                  <div className="skeleton-text skeleton-email-text"></div>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default LinkedInProfilesView; 