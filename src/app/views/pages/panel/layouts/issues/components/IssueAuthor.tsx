import { PeopleGroupIcon } from '@icons';

export const IssueAuthor = ({ value }: { value: string }) => {
  const isAI = value === 'paranoidandroid';
  return (
    <div className="issue-author">
      {isAI ? <img src={`/codefend/issues-bug-icon.svg`} alt="bug-icon" /> : <PeopleGroupIcon />}
      <span>{isAI ? 'ai' : value}</span>
    </div>
  );
};
