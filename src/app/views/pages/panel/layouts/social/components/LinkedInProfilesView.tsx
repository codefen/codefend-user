import { type FC, type MouseEvent } from 'react';
import { useNavigate } from 'react-router';
import type { MemberV2 } from '@interfaces/panel';
import { LinkedinV2Icon, EmailIcon } from '@icons';
import '../socialEngineering.scss';

interface LinkedInProfilesViewProps {
  members: MemberV2[];
  sentryRef: (node?: Element | null | undefined) => void;
}

const LinkedInProfilesView: FC<LinkedInProfilesViewProps> = ({ members, sentryRef }) => {
  const navigate = useNavigate();
  
  // Filtrar solo los miembros que tienen LinkedIn
  const linkedInMembers = members.filter(member => member.linkedin_url);
  
  const handleMemberClick = (email: string, event: MouseEvent) => {
    // Prevenir la navegación si se hace clic en el enlace de LinkedIn
    if ((event.target as HTMLElement).closest('a')) {
      return;
    }

    // Navegar a SNS con los parámetros de búsqueda
    navigate(`/sns?keyword=${encodeURIComponent(email)}&class=email`);
  };

  if (linkedInMembers.length === 0) {
    return (
      <div className="card">
        <div className="no-results-found">
          <p>No se encontraron perfiles de LinkedIn.</p>
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
            
            {/* Imagen a la izquierda */}
            <div className="linkedin-profile-image">
              {/* Por ahora usamos un placeholder, se puede reemplazar con member.linkedin_profile cuando esté disponible */}
              <img 
                src="/util/default-profilemedia.webp" 
                alt={`${member.name || member.email} profile`}
                onError={(e) => {
                  // Fallback si la imagen no carga
                  (e.target as HTMLImageElement).src = '/util/default-profilemedia.webp';
                }}
              />
            </div>

            {/* Información a la derecha */}
            <div className="linkedin-profile-info">
              <div className="linkedin-profile-name">
                <h4>{member.name || 'Nombre no disponible'}</h4>
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
      </div>
    </div>
  );
};

export default LinkedInProfilesView; 