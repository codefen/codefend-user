import { PrimaryButton } from '@buttons/index';
import css from './dashboardresource.module.scss';
import useModalStore from '@stores/modal.store';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';

export const DashboardAddResource = () => {
  const { setIsOpen, setModalId } = useModalStore();
  const addResource = () => {
    setIsOpen(true);
    setModalId(MODAL_KEY_OPEN.USER_ADD_NEW_RESOURCES);
  };
  return (
    <div className={css['box-assets-right']}>
      <div className={css['info-resource']}>
        <h2>Add resources</h2>
        <p>
          Add resources so we can better size your attack surface and design a plan tailored to your
          needs.
        </p>
      </div>
      <PrimaryButton text="go to resources" buttonStyle="red" click={addResource} />
    </div>
  );
};
