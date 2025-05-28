import { useState, type FC } from 'react';
import { GlobeWebIcon } from '@icons';
import ConfirmModal from '@modals/ConfirmModal.tsx';
import AddSubDomainModal from '@modals/adding-modals/AddSubDomainModal.tsx';
import AddDomainModal from '@modals/adding-modals/AddDomainModal.tsx';
import type { Webresource } from '@interfaces/panel.ts';
import useModalStore from '@stores/modal.store.ts';
import { PrimaryButton } from '@buttons/index';
import { MODAL_KEY_OPEN, RESOURCE_CLASS, TABLE_KEYS } from '@/app/constants/app-texts';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';

interface WebResourcesProps {
  isLoading: boolean;
}

interface SelectedResource {
  id: string;
  domain: string;
  serverIp: string;
}

export const WebApplicationTitle: FC<WebResourcesProps> = ({ isLoading }) => {
  const { setIsOpen, setModalId } = useModalStore();
  const webResourceSelected = useGlobalFastField('webResourceSelected');
  return (
    <div className="card title">
      <div className="header">
        <GlobeWebIcon />
        <span>Web software</span>
      </div>

      <div className="content">
        <p>
          Scope management for web resources. Add and remove domains and subdomains of your company
          that you want to monitor or run penetration tests on.
        </p>
        <div className="actions">
          <PrimaryButton
            text="Add domain"
            click={() => {
              if (isLoading) return;
              setIsOpen(true);
              setModalId(MODAL_KEY_OPEN.ADD_DOMAIN);
            }}
            className={'btn-black'}
            disabledLoader
          />
          <PrimaryButton
            text="Add subdomain"
            click={() => {
              webResourceSelected.set(null);
              if (isLoading) return;
              setIsOpen(true);
              setModalId(MODAL_KEY_OPEN.ADD_SUB_DOMAIN);
            }}
            className={'btn-black'}
            disabledLoader
          />
        </div>
      </div>
    </div>
  );
};
