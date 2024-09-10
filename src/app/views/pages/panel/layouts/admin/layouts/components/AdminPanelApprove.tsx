import { userApproveUser } from '@userHooks/admins/userApproveUser';
import { type FC, useEffect } from 'react';

const AdminPanelApprove: FC = () => {
  const { pendingUsers, handleApprove, getPanelApprove } = userApproveUser();

  useEffect(() => {
    getPanelApprove();
  }, []);

  return (
    <>
      <div className="user-approved-theader internal-tables">
        <div className="approved.theader-title internal-tables-active">
          <p className="text-small title-format">Users to be approved</p>
        </div>

        <div className="approved-theader-columns text-format">
          <p className="l">id</p>
          <p className="xl">full name</p>
          <p className="xl">email</p>
          <p className="l">country</p>
          <p className="xl">company</p>
          <p className="xl">role</p>
          <p className="xl">actions</p>
        </div>
      </div>
      <div className="user-approved-tbody internal-tables internal-tables-scroll">
        {pendingUsers.map((user: any) => (
          <div key={user.id} className="approved-tbody-item text-format">
            <p className="l">{user.id}</p>
            <p className="xl">{`${JSON.parse(user.json).user_name} ${
              JSON.parse(user.json).user_surname
            }`}</p>
            <p className="xl">{JSON.parse(user.json).user_email}</p>
            <p className="l">{JSON.parse(user.json).company_country}</p>
            <p className="xl">{JSON.parse(user.json).company_name}</p>
            <p className="xl">{JSON.parse(user.json).company_role}</p>
            <div className="approved-body-buttons">
              <button
                onClick={() => {
                  handleApprove(user.id, true);
                }}
                className="log-inputs btn-left">
                Appr
              </button>
              <button
                onClick={() => {
                  handleApprove(user.id, false);
                }}
                className="log-inputs btn-right">
                Rej
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AdminPanelApprove;
