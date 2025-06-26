import { useUserRole } from '#commonUserHooks/useUserRole';
import Show from '@/app/views/components/Show/Show';
import { PrimaryButton } from '@buttons/index';

export const IssuePanelHeader = ({ openAddIssue }: { openAddIssue: () => void }) => {
  const { isAdmin, isProvider } = useUserRole();

  return (
    <div className="card title">
      <div className="header">
        <img src={`/codefend/issues-bug-icon.svg`} alt="bug-icon" />
        <span>Issues</span>
      </div>
      <div className="content">
        <p>
          From this section, you can view the different issues identified for your organization,
          request help to resolve them, and generate reports.
        </p>
        <Show when={isAdmin() || isProvider()}>
          <PrimaryButton text="Add new issue" click={openAddIssue} className="btn btn-black" />
        </Show>
      </div>
    </div>
  );
};
