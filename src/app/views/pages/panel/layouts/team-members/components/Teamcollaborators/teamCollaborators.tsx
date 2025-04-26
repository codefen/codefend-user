import { PrimaryButton } from '@buttons/index';
import css from './teamcollaborators.module.scss';
import { PeopleGroupIcon } from '@/app/views/components';

export const TeamCollaborators = () => {
  return (
    <div className={css['team-collaborators']}>
      <PeopleGroupIcon />
      <div className={css['header-content']}>
        <h2>Collaborators and Members</h2>
        <p>
          Add collaborators and company members to help resolve detected vulnerabilities more
          easily.
          <strong>There is no limit to the number of collaborators!</strong>
        </p>

        <PrimaryButton
          text="Add a collaborator to the company"
          buttonStyle="red"
          // click={addResource}
        />
      </div>
    </div>
  );
};
