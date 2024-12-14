import { useSessionStorage } from 'usehooks-ts';
import ModalTitleWrapper from './modalwrapper/ModalTitleWrapper';
import type { UpdateAppState } from '@interfaces/user';
import { PrimaryButton } from '@buttons/index';

export const UpdateAppModal = () => {
  const [updateState, setHasUpdate] = useSessionStorage<UpdateAppState>('updateState', {
    hasUpdate: false,
  });

  return (
    <ModalTitleWrapper
      close={() => setHasUpdate({ hasUpdate: false })}
      isActive={updateState.hasUpdate}
      headerTitle="Update Available">
      <div className="p-4">
        {updateState.update && (
          <header>
            <h4 className="text-small title-format">
              Update to ${updateState.update.version} is available!
            </h4>
          </header>
        )}
        <div className="form-buttons">
          <PrimaryButton
            buttonStyle="black"
            text="Cancel"
            className="btn-cancel codefend_secondary_ac"
            isDisabled={updateState.acceptUpdate}
            disabledLoader
            click={() => setHasUpdate({ hasUpdate: false, rejectUpdate: true })}
          />
          <PrimaryButton
            buttonStyle="red"
            text="Update"
            className="btn-add codefend_main_ac limit-height"
            isDisabled={updateState.acceptUpdate}
            click={() => setHasUpdate({ hasUpdate: false, acceptUpdate: true })}
          />
        </div>
      </div>
    </ModalTitleWrapper>
  );
};
