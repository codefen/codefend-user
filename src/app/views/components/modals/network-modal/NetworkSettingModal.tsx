import { type FC, type FormEvent, useEffect, useState } from 'react';
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

/** Misma lógica que CardPaymentModal: respeta `stripeEnv` guardado; si no existe, default test solo en dev. */
function readStripeTestModeFromStorage(): boolean {
  const v = localStorage.getItem('stripeEnv');
  if (v === 'true') return true;
  if (v === 'false') return false;
  return NODE_ENV === 'development';
}

interface NetworkSettingModalProps {
  isOpen: boolean;
  close: () => void;
}

export const NetworkSettingModal: FC<NetworkSettingModalProps> = ({ close, isOpen }) => {
  const [insecure, setInsecure] = useState(
    localStorage.getItem('a20af8d9') == 'true' ? true : false
  );
  const [isStripeTestModeActive, setStripeEnv] = useState(() => readStripeTestModeFromStorage());
  const customAPi = getCustomBaseAPi();
  const defaultApiUrl = customAPi ? customAPi : baseUrl;
  const [apiUrl, setApiUrl] = useState(defaultApiUrl);
  const [canEdit, setCanEdit] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { logout } = useUserData();

  useEffect(() => {
    if (!isOpen) return;
    setStripeEnv(readStripeTestModeFromStorage());
    setInsecure(localStorage.getItem('a20af8d9') == 'true');
  }, [isOpen]);

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
    const apiChanged = apiUrl !== defaultApiUrl;
    close();
    setLoading(false);
    if (apiChanged) {
      setCustomBaseAPi(apiUrl);
      toast.success(APP_MESSAGE_TOAST.SERVER_UPDATED);
      logout();
      window.location.reload();
    } else {
      toast.success(APP_MESSAGE_TOAST.SERVER_UPDATED);
    }
  };

  const handleCancel = () => {
    close();
    setInsecure(localStorage.getItem('a20af8d9') == 'true');
    setStripeEnv(readStripeTestModeFromStorage());
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
                <h4 className="network-header_title title-format">Quick variables</h4>
              </header>
              <form onSubmit={handleSubmit} className="network-form">
                <div className="network-form_inputs">
                  <div className="network-form_inputs_description quick-var-block">
                    <h2><b>Alter backend connection wire:</b></h2>
                    <p>point the client into a different backend node, useful for research. it's recommended to use a secure protocol</p>
                  </div>
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
                      <option value="https://api.codefend.app/index.php"></option>
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
                    <div className="quick-var-block">
                      <h2><b>Send all communication in GET:</b></h2>
                      <p>this is an extreamly odd feature, useful for some automation and debugging. Warning! aside from being a bit insecure, it only affects your user.</p>
                      <PrimaryButton
                        text={!insecure ? 'OFF' : 'ON'}
                        buttonStyle="gray"
                        click={() => updateInsecure()}
                        disabledLoader
                        type="button"
                        className="network-form_inputs_extra_insecure"
                      />
                    </div>
                    <div className="quick-var-block">
                      <h2><b>Bypass merchant - Endless money:</b></h2>
                      <p>Use the software for free. Escencially it's a bypass in the payment system.</p>
                      <select 
                        value={isStripeTestModeActive ? 'endless' : 'real'}
                        onChange={(e) => {
                          const shouldBeTestMode = e.target.value === 'endless';
                          if (shouldBeTestMode !== isStripeTestModeActive) {
                            updateStripeEnv();
                          }
                        }}
                        className="payment-mode-dropdown"
                      >
                        <option value="endless">💰 Endless money activated.</option>
                        <option value="real">💳 Mmm, real payments are activated.</option>
                      </select>
                    </div>

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
