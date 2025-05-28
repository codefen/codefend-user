import { PeopleGroupIcon, PeopleIcon, SparklesIcon } from '@icons';

export const IssueAuthor = ({ isAI, value }: { isAI: boolean; value: string }) => {
  return (
    <div className="issue-author">
      {isAI ? <SparklesIcon /> : <PeopleIcon width="1rem" height="1rem" />}
      <span>{isAI ? 'ai' : value}</span>
    </div>
  );
};
