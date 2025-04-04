import { type FC } from 'react';
import { useAddSocial } from '@resourcesHooks/social/useAddSocial';
import { GlobeWebIcon } from '@icons';
import { ModalInput } from '@/app/views/components/ModalInput/ModalInput';
import type { ComponentEventWithChildren } from '@interfaces/util';

export const SocialResourceForm: FC<ComponentEventWithChildren> = ({ close, onDone, children }) => {
  const { handleAddSocialResource, isAddingMember, fName, lName, mail, phone, role } = useAddSocial(
    onDone ? onDone : () => {},
    close ? close : () => {}
  );

  const handleSubmit = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddSocialResource();
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <ModalInput ref={fName} placeholder="name" />
      <ModalInput ref={lName} placeholder="last name" />
      <ModalInput ref={mail} placeholder="email address" />
      <ModalInput ref={phone} placeholder="phone number" />

      <div className="form-input">
        <span className="icon">
          <GlobeWebIcon />
        </span>
        <select ref={role} id="social-data" className="log-inputs modal_info" required>
          <option value="" disabled hidden>
            role
          </option>
          <option value="admin">administrative</option>
          <option value="human">human resources</option>
          <option value="info">information tech</option>
          <option value="ads">marketing</option>
          <option value="sales">sales</option>
          <option value="finance">finance</option>
          <option value="cs">customer service</option>
          <option value="prod">production & ops</option>
          <option value="plan">strategy & planning</option>
          <option value="law">legal affairs</option>
        </select>
      </div>
      {children(isAddingMember)}
    </form>
  );
};

export default SocialResourceForm;
