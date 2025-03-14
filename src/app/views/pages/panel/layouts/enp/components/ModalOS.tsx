import { type FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AppleIcon, LinuxIcon, WindowsIcon } from '@icons';

import { getCustomBaseAPi } from '@utils/helper.ts';
import { baseUrl } from '@utils/config.ts';
import { useUserData } from '#commonUserHooks/useUserData.ts';
import { APP_MESSAGE_TOAST } from '@/app/constants/app-toast-texts.ts';
import { useEndpointAppStore } from '../EndpointContext.tsx';

type OsOptions = {
  [key: string]: string;
  windows: string;
  mac: string;
  linux: string;
};

export const ModalOS: FC = () => {
  const { getAccessToken, getCompany } = useUserData();
  const { closeModal, isModalOpen } = useEndpointAppStore();

  const [selectedOS, setSelectedOS] = useState<string>('windows');
  const [showModal, setShowModal] = useState(false);

  const customAPi = getCustomBaseAPi();
  const _baseUrl = customAPi ? customAPi : baseUrl;
  let parsedUrl = new URL(_baseUrl);
  let reducedUrl = `${parsedUrl.host}${parsedUrl.pathname}`.replace(/\/[^\/]*$/, '');

  const osOptions: OsOptions = {
    windows: `Invoke-WebRequest -Uri "https://web.codefend.com/releases/codefend-windows.exe" -OutFile "$env:TEMPcodefend-windows.exe"; & "$env:TEMPcodefend-windows.exe" '${getAccessToken()}' '${getCompany()}' '${reducedUrl}'; Pause; Remove-Item "$env:TEMPcodefend-windows.exe"`,
    mac: 'Mac Command',
    linux: `wget https://web.codefend.com/releases/codefend-linux -O /tmp/codefend-linux && chmod +x /tmp/codefend-linux && /tmp/codefend-linux ${getAccessToken()} ${getCompany()} ${reducedUrl}; rm /tmp/codefend-linux`,
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(APP_MESSAGE_TOAST.COPY_TEXT);
    } catch (err) {
      console.error(APP_MESSAGE_TOAST.FAILURE_COPY, err);
    }
  };

  const handleSelectOS = (os: string) => {
    setSelectedOS(os);
  };

  useEffect(() => {
    if (isModalOpen) {
      return setShowModal(true);
    }
    return setShowModal(false);
  }, [isModalOpen]);

  return (
    showModal && (
      <div id="select-modal" onClick={closeModal} className="modal-os-container">
        <div onClick={e => e.stopPropagation()} className="modal-os-wrapper">
          <div className="modal-os">
            <div className="modal-os-header">
              <h3>Select an Operating System</h3>
            </div>
            <div className="modal-os-content">
              <div className="os-content-header-wrapper">
                <div className="os-content-header" onClick={() => handleSelectOS('windows')}>
                  <div className={`os-icon ${selectedOS === 'windows' ? 'isSelectIcon' : 'other'}`}>
                    <WindowsIcon />
                  </div>
                </div>

                <div className="os-content-header" onClick={() => handleSelectOS('linux')}>
                  <div className={`os-icon ${selectedOS === 'linux' ? 'isSelectIcon' : 'other'}`}>
                    <LinuxIcon />
                  </div>
                </div>

                <div
                  className="os-content-header"
                  onClick={() =>
                    //handleSelectOS('mac')
                    true
                  }>
                  <div className={`os-icon ${selectedOS === 'mac' ? 'isSelectIcon' : 'other'}`}>
                    <AppleIcon />
                  </div>
                </div>
              </div>
              {selectedOS && (
                <div className="os-select-content">
                  <p>Use the following command in the target device:</p>
                  <div
                    className="os-option-wrapper "
                    onClick={() => copyToClipboard(osOptions[selectedOS])}>
                    <pre>{osOptions[selectedOS]}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};
