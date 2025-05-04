import { PeopleGroupIcon } from '@icons';

export const UserProfileTop = () => {
  return (
    <div className="user-profile-top">
      <PeopleGroupIcon />
      <div className="profile-info">
        <h2>User profile</h2>
        <br />
        <p>
          Add collaborators and company members to help resolve detected vulnerabilities more
          easily. <strong>There is no limit to the number of collaborators!</strong>
        </p>
      </div>
    </div>
  );
};
