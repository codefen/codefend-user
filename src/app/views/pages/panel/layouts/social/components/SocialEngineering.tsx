import { type FC, type MouseEvent } from 'react';
import { useNavigate } from 'react-router';
import '../socialEngineering.scss';
import { LinkedinV2Icon } from '@/app/views/components/icons/LinkedinV2Icon';
import type { MemberV2 } from '@interfaces/panel';

interface SocialEngineeringProps {
  paginatedMembers: MemberV2[];
  sentryRef: (node?: Element | null | undefined) => void;
}

const SocialEngineering: FC<SocialEngineeringProps> = ({ paginatedMembers, sentryRef }) => {
  const navigate = useNavigate();
  const isLoading = !paginatedMembers || paginatedMembers.length === 0;
  const hasMore = paginatedMembers.length > 0 && paginatedMembers.length % 10 === 0; // Suponiendo que se cargan 10 elementos por página

  const handleMemberClick = (email: string, event: MouseEvent) => {
    // Prevenir la navegación si se hace clic en el enlace de LinkedIn
    if ((event.target as HTMLElement).closest('a')) {
      return;
    }

    // Navegar a SNS con los parámetros de búsqueda
    navigate(`/sns?keyword=${encodeURIComponent(email)}&class=email`);
  };

  return (
    <div className="card">
      <div className="social-grid">
        {!isLoading &&
          paginatedMembers.map((member, index) => (
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
        {hasMore ? (
          <div className="loading-message">More elements loading...</div>
        ) : (
          <div className="loading-message">All elements are listed.</div>
        )}
      </div>
    </div>
  );
};

export default SocialEngineering;
