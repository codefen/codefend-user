import { useAddResourceCredentials } from '@resourcesHooks/global/useAddResourceCredentials';
import type { FC } from 'react';
import { GlobeWebIcon } from '@icons';
import { ModalTextArea } from '@/app/views/components/ModalTextArea/ModalTextArea';
import { ModalInput } from '@/app/views/components/ModalInput/ModalInput';
import { ModalButtons } from '@/app/views/components/utils/ModalButtons';

interface AddCredentialsProps {
  type: string;
  resourceId: string;
  close: () => void;
  onComplete?: () => void;
}

export const AddCredentials: FC<AddCredentialsProps> = ({
  type,
  resourceId,
  close,
  onComplete,
}) => {
  const { handleSend, isLoading, userNameOrEmail, password, accessLevel, grades } =
    useAddResourceCredentials();

  const handleClickSend = (e: any) => {
    e.preventDefault();
    handleSend(type, resourceId).finally(() => {
      close();
      if (onComplete) onComplete();
    });
  };

  return (
    <form className="form" onSubmit={handleClickSend}>
      <ModalInput
        ref={userNameOrEmail}
        placeholder="User credential (Username or Email)"
        required
      />
      <ModalInput type="password" ref={password} placeholder="Password credential" required />
      <div className="form-input">
        <span className="icon">
          <GlobeWebIcon />
        </span>

        <select ref={accessLevel} className="log-inputs modal_info" defaultValue="none" required>
          <option value="none" disabled hidden>
            Access Level
          </option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <ModalTextArea
        ref={grades}
        className="text-area-input xll"
        placeholder="You can provide additional information for access."
        maxLength={4000}
      />

      <ModalButtons close={close} isDisabled={isLoading} confirmText="Add credential" />
    </form>
  );
};
