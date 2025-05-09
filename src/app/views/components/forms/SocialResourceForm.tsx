import { type FC, type FormEvent } from 'react';
import { useAddSocial } from '@resourcesHooks/social/useAddSocial';
import { GlobeWebIcon } from '@icons';
import { ModalInput } from '@/app/views/components/ModalInput/ModalInput';
import type { ComponentEventWithChildren } from '@interfaces/util';
import SelectField from '@/app/views/components/SelectField/SelectField';

export const SocialResourceForm: FC<ComponentEventWithChildren> = ({ close, onDone, children }) => {
  const { handleAddSocialResource, isAddingMember } = useAddSocial(
    onDone ? onDone : () => {},
    close ? close : () => {}
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    handleAddSocialResource(formData);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <ModalInput name="member_fname" placeholder="name" />
      <ModalInput name="member_lname" placeholder="last name" />
      <ModalInput name="member_email" placeholder="email address" />
      <ModalInput name="member_phone" placeholder="phone number" />
      <SelectField
        className="form-input"
        name="member_role"
        options={memberRoles}
        required
        icon={<GlobeWebIcon />}
      />
      {children(isAddingMember)}
    </form>
  );
};

const memberRoles = [
  {
    label: 'role',
    value: '',
    hidden: true,
  },
  {
    label: 'administrative',
    value: 'admin',
  },
  {
    label: 'human resources',
    value: 'human',
  },
  {
    label: 'information tech',
    value: 'info',
  },
  {
    label: 'marketing',
    info: 'ads',
  },
  {
    label: 'sales',
    vale: 'sales',
  },
  {
    label: 'customer service',
    value: 'cs',
  },
  {
    label: 'production & ops',
    value: 'prod',
  },
  {
    label: 'strategy & planning',
    value: 'plan',
  },
  {
    label: 'legal affairs',
    value: 'law',
  },
];

export default SocialResourceForm;
