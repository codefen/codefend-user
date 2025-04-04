import { type FC, type FormEvent } from 'react';
import { useAddMobileResource } from '@resourcesHooks/mobile/useAddMobileResource';
import { ModalInput } from '@/app/views/components/ModalInput/ModalInput';
import type { ComponentEventWithChildren } from '@interfaces/util';

const MobileResourceForm: FC<ComponentEventWithChildren> = ({ close, onDone, children }) => {
  const { handleAddMobileResource, iosAddress, androidAddress, isAddingMobile } =
    useAddMobileResource();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    handleAddMobileResource(onDone ? onDone : () => {}, close ? close : () => {});
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <ModalInput ref={androidAddress} placeholder="android download link" />
      <ModalInput ref={iosAddress} placeholder="ios download link" />
      {children(isAddingMobile)}
    </form>
  );
};

export default MobileResourceForm;
