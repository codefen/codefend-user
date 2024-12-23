import ModalTitleWrapper from '../modalwrapper/ModalTitleWrapper';
import { PrimaryButton } from '@buttons/index';
import scss from './updateapp.module.scss';
import { useUploadingStore } from '@stores/updating.store';
import { RUNNING_DESKTOP } from '@utils/helper';

export const UpdateAppModal = () => {
  const { setHas, setAccept, setReject, ...updateState } = useUploadingStore();

  return (
    <ModalTitleWrapper
      close={() => setHas(false)}
      isActive={updateState?.has && !updateState.reject && RUNNING_DESKTOP()}
      headerTitle="Update Available">
      <div className={scss['update-app-modal-container']}>
        {updateState?.update && (
          <h4 className="text-small title-format">
            Update to v{updateState.update.version} is available!
          </h4>
        )}
        <div className="form-buttons">
          <PrimaryButton
            buttonStyle="black"
            text="Cancel"
            className="btn-cancel codefend_secondary_ac"
            isDisabled={updateState.accept}
            disabledLoader
            click={() => {
              setReject(true);
            }}
          />
          <PrimaryButton
            buttonStyle="red"
            text="Update"
            className="btn-add codefend_main_ac limit-height"
            isDisabled={updateState.accept}
            click={() => {
              setAccept(true);
            }}
          />
        </div>
      </div>
    </ModalTitleWrapper>
  );
};
