import { PrimaryButton } from '@buttons/index';
import css from './dashboardresource.module.scss';
import DashboardAssets from '../../../../../../components/DashboardAssets/DashboardAssets';
import useModalStore from '@stores/modal.store';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';

export const DashboardAddResource = ({ data }: any | []) => {
  const { setIsOpen, setModalId } = useModalStore();
  const addResource = () => {
    setIsOpen(true);
    setModalId(MODAL_KEY_OPEN.USER_ADD_NEW_RESOURCES);
  };

  return (
    <div className={css['box-assets-right']}>
      <div className={css['box-assets-info']}>
        <div className={css['info-resource']}>
          <div className="title">
            <h2>Resources</h2>
            <span className="link" onClick={addResource}>
              go to resources
            </span>
          </div>
          <p>
            Add resources so we can size your attack surface and design a plan tailored to your
            needs
          </p>
        </div>
        {/* <PrimaryButton text="go to resources" buttonStyle="red" click={addResource} /> */}
      </div>
      <DashboardAssets resources={data?.resources || {}} borderStyle={true} />
    </div>
  );
};
