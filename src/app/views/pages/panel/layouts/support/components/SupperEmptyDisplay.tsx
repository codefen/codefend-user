import { SimpleSection } from '@/app/views/components/SimpleSection/SimpleSection';
import { MessageIcon, RobotIcon } from '@icons';

export const SupperEmptyDisplay = () => {
  return (
    <div className="card messages empty-state">
      <SimpleSection header="Chat with hacker" icon={<MessageIcon />}>
        <div className="content">
          <RobotIcon width="120" height="120" />
          <h3>Hello! You don't have any questions yet</h3>
          <p>Ask your first question to get started.</p>
        </div>
      </SimpleSection>
    </div>
  );
};
