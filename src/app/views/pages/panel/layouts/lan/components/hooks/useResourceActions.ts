import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import useModalStore from '@stores/modal.store.ts';
import useCredentialStore from '@stores/credential.store.ts';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { MODAL_KEY_OPEN, RESOURCE_CLASS } from '@/app/constants/app-texts';
import type { Device } from '@interfaces/panel.ts';

// Extended interface for network resources
interface NetworkDevice extends Device {
  all_found_domains?: string;
  all_found_domains_value?: string;
  server_pais?: string;
  server_pais_code?: string;
  server_pais_provincia?: string;
  server_pais_ciudad?: string;
  device_class?: string;
  neuroscan_id?: string;
  neuroscan_main_domain?: string;
  source?: string;
}

export interface UseResourceActionsReturn {
  handleViewReport: (resource: NetworkDevice) => void;
  handleViewCredentials: (resource: NetworkDevice) => void;
  handleDelete: (resource: NetworkDevice) => void;
  handleAddIssue: (resource: NetworkDevice) => void;
  handleAddSubNetwork: (resource: NetworkDevice) => void;
  canDelete: boolean;
  canAddIssue: boolean;
  canAddSubNetwork: (resource: NetworkDevice | null | undefined) => boolean;
  hasIssues: (resource: NetworkDevice | null | undefined) => boolean;
}

/**
 * Custom hook for resource actions with optimized callbacks and permissions
 */
export const useResourceActions = (): UseResourceActionsReturn => {
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

  // Generate report action with validation
  const generateReport = useCallback(
    (resourceId: string, issueCount: string | number) => {
      if (!resourceId || Number(issueCount) < 1) return;
      openModal.set(true);
      resourceID.set(resourceId);
      resourceType.set(RESOURCE_CLASS.LAN_NET);
    },
    [openModal, resourceID, resourceType]
  );

  // Navigate to add issue page with validation
  const addIssue = useCallback(
    (id: string) => {
      if (!id) return;
      const canNavigate = isProvider() || isAdmin();
      if (canNavigate) {
        navigate(`/issues/create/lan/${id}`, {
          state: { redirect: location.pathname },
        });
      }
    },
    [navigate, isProvider, isAdmin, location.pathname]
  );

  // Memoized action handlers with null safety
  const handleViewReport = useCallback(
    (resource: NetworkDevice) => {
      if (!resource) return;
      generateReport(resource.id, resource.final_issues || 0);
    },
    [generateReport]
  );

  const handleViewCredentials = useCallback(
    (resource: NetworkDevice) => {
      if (!resource) return;
      setResourceId(resource.id);
      setCredentialType('lan');
      setIsOpen(true);
      setModalId(MODAL_KEY_OPEN.NETWORK_CREDS);
    },
    [setResourceId, setCredentialType, setIsOpen, setModalId]
  );

  const handleDelete = useCallback(
    (resource: NetworkDevice) => {
      if (!resource) return;
      networkResourceSelected.set(resource);
      setIsOpen(true);
      setModalId(MODAL_KEY_OPEN.DELETE_NETWORK);
    },
    [networkResourceSelected, setIsOpen, setModalId]
  );

  const handleAddIssue = useCallback(
    (resource: NetworkDevice) => {
      if (!resource) return;
      addIssue(resource.id);
    },
    [addIssue]
  );

  const handleAddSubNetwork = useCallback(
    (resource: NetworkDevice) => {
      if (!resource) return;
      networkResourceSelected.set(resource);
      setIsOpen(true);
      setModalId(MODAL_KEY_OPEN.ADD_SUB_NETWORK);
    },
    [networkResourceSelected, setIsOpen, setModalId]
  );

  // Permission checkers (memoized)
  const canDelete = !isProvider();
  const canAddIssue = isProvider() || isAdmin();

  const canAddSubNetwork = useCallback((resource: NetworkDevice | null | undefined): boolean => {
    if (!resource) return false;
    return !resource.resource_lan_dad;
  }, []);

  const hasIssues = useCallback((resource: NetworkDevice | null | undefined): boolean => {
    if (!resource) return false;
    return Number(resource.final_issues || 0) >= 1;
  }, []);

  return {
    handleViewReport,
    handleViewCredentials,
    handleDelete,
    handleAddIssue,
    handleAddSubNetwork,
    canDelete,
    canAddIssue,
    canAddSubNetwork,
    hasIssues,
  };
};
