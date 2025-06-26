import { GlobeWebIcon, LanIcon, NetworkIcon } from '@icons';
import { PrimaryButton } from '../../../../../components/buttons/primary/PrimaryButton';

export const NewQuestHacker = () => {
  return (
    <div className="new-quest-hacker">
      <div className="new-quest_header">
        <GlobeWebIcon />
        <h2>New question</h2>
      </div>
      <p>
        Send a new query to one of our professional hackers, we will do our best to respond in less
        than 24 hours.
      </p>
      <PrimaryButton text="Ask a new question" buttonStyle="black" />
    </div>
  );
};
