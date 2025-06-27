import { type FC } from 'react';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import useModalStore from '@stores/modal.store.ts';
import useCredentialStore from '@stores/credential.store.ts';
import type { Device } from '@interfaces/panel.ts';

// Extended interface for network resources with server location data
interface NetworkDevice extends Device {
  all_found_domains?: string;
  server_pais?: string;
  server_pais_code?: string;
  server_pais_provincia?: string;
  server_pais_ciudad?: string;
  device_class?: string;
  neuroscan_id?: string;
  neuroscan_main_domain?: string;
  source?: string;
}
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { MODAL_KEY_OPEN, RESOURCE_CLASS } from '@/app/constants/app-texts';
import { BugIcon, CredentialIcon, DocumentIcon, TrashIcon, PlusIcon } from '@icons';
import { useLocation, useNavigate } from 'react-router';
import { NetworkResourceCard } from './NetworkResourceCard.tsx';

interface CardsResourcesWanProps {
  isLoading: boolean;
  internalNetwork: NetworkDevice[];
  refetchInternalNetwork: () => void;
}

export const CardsResourcesWan: FC<CardsResourcesWanProps> = ({ 
  isLoading, 
  internalNetwork,
  refetchInternalNetwork 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCredentialType, setResourceId } = useCredentialStore();
  const { setIsOpen, setModalId } = useModalStore();
  const { isAdmin, isProvider } = useUserRole();

  const { resourceType, openModal, resourceID, networkResourceSelected } = useGlobalFastFields([
    'resourceType',
    'openModal',
    'resourceID',
    'networkResourceSelected',
  ]);

  const generateReport = (resourceUpID: string, count: any) => {
    if (Number(count) >= 1) {
      openModal.set(true);
      resourceID.set(resourceUpID);
      resourceType.set(RESOURCE_CLASS.LAN_NET);
    }
  };

  const addIssue = (id: string) => {
    navigate(isProvider() || isAdmin() ? `/issues/create/lan/${id}` : '', {
      state: { redirect: location.pathname },
    });
  };

  const handleViewReport = (row: NetworkDevice) => {
    generateReport(row.id, row.final_issues);
  };

  const handleViewCredentials = (row: NetworkDevice) => {
    setResourceId(row.id);
    setCredentialType('lan');
    setIsOpen(true);
    setModalId(MODAL_KEY_OPEN.NETWORK_CREDS);
  };

  const handleDelete = (row: NetworkDevice) => {
    networkResourceSelected.set(row);
    setIsOpen(true);
    setModalId(MODAL_KEY_OPEN.DELETE_NETWORK);
  };

  const handleAddIssue = (row: NetworkDevice) => {
    addIssue(row.id);
  };

  const handleAddSubNetwork = (row: NetworkDevice) => {
    networkResourceSelected.set(row);
    setIsOpen(true);
    setModalId(MODAL_KEY_OPEN.ADD_SUB_NETWORK);
  };

  if (isLoading) {
    return (
      <div className="card">
        <div className="network-cards-container">
          <div className="loading-message">Loading network resources...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="network-cards-container">
        {internalNetwork.map((resource) => (
          <NetworkResourceCard
            key={resource.id}
            resource={resource}
            onViewReport={handleViewReport}
            onViewCredentials={handleViewCredentials}
            onDelete={handleDelete}
            onAddIssue={handleAddIssue}
            onAddSubNetwork={handleAddSubNetwork}
            canDelete={!isProvider()}
            canAddIssue={isProvider() || isAdmin()}
            canAddSubNetwork={!resource.resource_lan_dad}
            hasIssues={Number(resource.final_issues) >= 1}
          />
        ))}
      </div>
    </div>
  );
}; 