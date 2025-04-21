import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation } from '@/app/constants/validations';
import { PasswordRequirements } from '@/app/views/components/PasswordRequirements/PasswordRequirements';
import { ModalTitleWrapper } from '@modals/index';
import useModalStore from '@stores/modal.store';
import { useState, type FormEvent } from 'react';
import { toast } from 'react-toastify';

export const ChangePasswordModal = () => {
  const { isOpen, modalId, setModalId, setIsOpen } = useModalStore();
  const [fetcher, _, isLoading] = useFetcher();
  const { getCompany } = useUserData();
  const [password, setPassword] = useState('');
  const handleClose = () => {
    setIsOpen(false);
    setModalId('');
  };
  const submitChangePassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!data.get('currentPassword') || !data.get('newPassword') || !data.get('confirmPassword')) {
      toast.error('Passwords do not match');
      return;
    }
    if (data.get('newPassword') !== data.get('confirmPassword')) {
      toast.error('All fields are required');
      return;
    }

    fetcher('post', {
      requireSession: true,
      body: {
        company_id: getCompany() || '',
        previous_password: data.get('currentPassword'),
        new_password: data.get('newPassword'),
      },
      path: 'users/password/mod',
    }).then(({ data }: any) => {
      if (apiErrorValidation(data?.error, data?.response)) {
        toast.error('The new password or the old password is invalid');
        return;
      }
      handleClose();
      toast.success('Password updated successfully');
    });
  };
  return (
    <ModalTitleWrapper
      isActive={isOpen && modalId === 'changepassword'}
      headerTitle="Change Password"
      type="changepassword-modal"
      close={handleClose}>
      <form onSubmit={submitChangePassword}>
        <div className="input-group">
          <input type="password" name="currentPassword" placeholder="Current Password" />
        </div>
        <div className="input-group">
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div className="input-group">
          <input type="password" name="confirmPassword" placeholder="Confirm Password" />
        </div>
        <PasswordRequirements password={password} />
        <button disabled={isLoading} type="submit" className="btn btn-primary">
          Change Password
        </button>
      </form>
    </ModalTitleWrapper>
  );
};
