import { PeopleGroupIcon } from '@icons';

export const UserProfileTop = () => {
  return (
    <div className="card rectangle">
      <div className="over">
        <PeopleGroupIcon />
        <div className="header-content">
          <h2>User profile</h2>
          <p>
            Add collaborators and company members to help resolve detected vulnerabilities more
            easily. <strong>There is no limit to the number of collaborators!</strong>
          </p>
        </div>
      </div>
    </div>
  );
};
