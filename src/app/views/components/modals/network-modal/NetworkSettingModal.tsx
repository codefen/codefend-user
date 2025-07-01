import { type FC, type FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { EditIcon, ShieldOffIcon, ShieldOnIcon } from '@icons';
import Show from '@/app/views/components/Show/Show';
import ModalWrapper from '@modals/modalwrapper/ModalWrapper.tsx';
import { deleteCustomBaseAPi, getCustomBaseAPi, setCustomBaseAPi } from '@utils/helper.ts';
import { baseUrl, nodeEnv } from '@utils/config.ts';
import './networkSetting.scss';
import { PrimaryButton } from '../..';
import { useUserData } from '#commonUserHooks/useUserData';
import { APP_MESSAGE_TOAST } from '@/app/constants/app-toast-texts';
import { ModalButtons } from '@/app/views/components/utils/ModalButtons';

const NODE_ENV = nodeEnv;
console.log('NODE_ENV', NODE_ENV);
interface NetworkSettingModalProps {
  isOpen: boolean;
  close: () => void;
}

export const NetworkSettingModal: FC<NetworkSettingModalProps> = ({ close, isOpen }) => {
  const [insecure, setInsecure] = useState(
    localStorage.getItem('a20af8d9') == 'true' ? true : false
  );
  const [isStripeTestModeActive, setStripeEnv] = useState(
    localStorage.getItem('stripeEnv') == 'true' || NODE_ENV == 'development' ? true : false
  );
  const customAPi = getCustomBaseAPi();
  const defaultApiUrl = customAPi ? customAPi : baseUrl;
  const [apiUrl, setApiUrl] = useState(defaultApiUrl);
  const [canEdit, setCanEdit] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { logout } = useUserData();

  const setDefaultUrl = (url: string) => {
    deleteCustomBaseAPi();
    setApiUrl(url);
    close();
    toast.success(APP_MESSAGE_TOAST.SERVER_UPDATED);
    logout();
    window.location.reload();
  };
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCanEdit(false);
    setLoading(true);

    if (apiUrl.length < 10) {
      toast.error(APP_MESSAGE_TOAST.INVALID_API_URL);
      setLoading(false);
      return;
    }
    localStorage.setItem('a20af8d9', String(insecure));
    localStorage.setItem('stripeEnv', String(isStripeTestModeActive));
    close();
    setLoading(false);
    if (apiUrl !== defaultApiUrl) {
      setCustomBaseAPi(apiUrl);
      toast.success(APP_MESSAGE_TOAST.SERVER_UPDATED);
      logout();
      window.location.reload();
    }
  };

  const handleCancel = () => {
    close();
    setInsecure(localStorage.getItem('insecure') == 'true' ? true : false);
    setStripeEnv(
      localStorage.getItem('stripeEnv') == 'true' || NODE_ENV == 'development' ? true : false
    );
  };

  const updateInsecure = () => setInsecure(prev => !prev);
  const updateStripeEnv = () => setStripeEnv(prev => !prev);

  return (
    <Show when={isOpen}>
      <ModalWrapper action={close}>
        <div
          className="modal-wrapper-title internal-tables disable-border"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
          }}>
          <div className="network-modal-container">
            <div className="network-modal-content disable-border">
              <header className="network-header">
                <h4 className="network-header_title title-format">Network Setting</h4>
              </header>
              <form onSubmit={handleSubmit} className="network-form">
                <div className="network-form_inputs">
                  <div className="network-form_inputs_edit">
                    <input
                      value={apiUrl}
                      disabled={!canEdit}
                      type="url"
                      onChange={e => setApiUrl(e.target.value)}
                      className={` log-inputs ${!canEdit && 'opacity'}`}
                      placeholder="Enter API URI"
                      list="api-urls"
                      required
                    />
                    <datalist id="api-urls">
                      <option value="https://api.codefend.com/index.php"></option>
                    </datalist>
                    <button
                      onClick={() => setCanEdit(currentValue => !currentValue)}
                      type="button"
                      className="edit-btn">
                      <span className={`edit-btn_icon ${!canEdit ? 'off' : 'on'}`}>
                        <EditIcon width={2} height={2} />
                      </span>
                    </button>
                  </div>

                  <div className="network-form_inputs_extra">
                    <PrimaryButton
                      text={!insecure ? <ShieldOnIcon /> : <ShieldOffIcon />}
                      buttonStyle="gray"
                      click={() => updateInsecure()}
                      disabledLoader
                      type="button"
                      className="network-form_inputs_extra_insecure"
                    />
                    <PrimaryButton
                      text={isStripeTestModeActive ? 'STT' : 'STL'}
                      buttonStyle="gray"
                      click={() => updateStripeEnv()}
                      disabledLoader
                      type="button"
                      className="network-form_inputs_extra_insecure"
                    />

                    <span
                      onClick={() => setDefaultUrl(baseUrl)}
                      className="network-form_inputs_extra_reset codefend-text-red">
                      click here to set back to default
                    </span>
                  </div>
                </div>

                <ModalButtons
                  close={handleCancel}
                  isDisabled={isLoading}
                  confirmText="Save changes"
                />
              </form>
            </div>
          </div>
        </div>
      </ModalWrapper>
    </Show>
  );
};
