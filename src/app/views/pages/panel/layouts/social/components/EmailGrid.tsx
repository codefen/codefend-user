import type { MemberV2 } from '@interfaces/panel';

interface EmailGridProps {
  members: MemberV2[];
}

export const EmailGrid = ({ members }: EmailGridProps) => {
  return (
    <div className="email-grid-container">
      {members.map((member) => (
        <div key={member.id} className="email-card">
          <span>{member.email}</span>
        </div>
      ))}
    </div>
  );
}; 