import { useUserData } from '#commonUserHooks/useUserData';
import useModalStore from '@stores/modal.store';
import { formatDate } from '@utils/helper';

const SettingPersonalDetails = () => {
  const { getUserdata } = useUserData();
  const { setModalId, setIsOpen } = useModalStore();
  getUserdata().username;
  const userImportantData = {
    ['Name']: getUserdata().fname ? `${getUserdata().fname} ${getUserdata().lname}` : '---',
    email: getUserdata().email || '---',
    country: getUserdata().pais || '---',
    province: getUserdata().pais_provincia || '---',
    role: getUserdata().role || '---',
    username: getUserdata().username || '---',
    ['created at']: formatDate(getUserdata().creacion || '') || '---',
  };

  const handleChangePassword = () => {
    setIsOpen(true);
    setModalId('changepassword');
  };

  return (
    <div className="table-company-data internal-tables">
      <div className="internal-tables-active company-data-header">
        <p className="text-small title-format">YOUR PERSONAL DETAILS |</p>
        <button
          className="actions codefend-text-red no-border no-outline bolder"
          onClick={handleChangePassword}>
          CHANGE PASSWORD
        </button>
      </div>
      <div className="company-data-main">
        <div className="company-data-main-wrapper">
          {Object.entries(userImportantData).map((data, index) => (
            <div key={index} className="company-table-content text-format">
              <section className="company-data-content">
                <p>{data[0]}</p>
                <p>{data[1]}</p>
              </section>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingPersonalDetails;
