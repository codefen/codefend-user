import { PeopleGroupIcon } from '@icons';

export const UserProfileTop = () => {
  return (
    <div className="user-profile-top">
      <PeopleGroupIcon />
      <div className="profile-info">
        <h2>User profile</h2>
        <p>
          Añada colaboradores y miembros de su empresa para resolver las vulnerabilidades
          localizadas con mayor facilidad. <strong>No hay un máximo de colaboradores!</strong>
        </p>
      </div>
    </div>
  );
};
