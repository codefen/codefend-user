import { type FC, useState, useMemo, useEffect, useRef } from 'react';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import useModalStore from '@stores/modal.store.ts';
import useCredentialStore from '@stores/credential.store.ts';
import type { Device } from '@interfaces/panel.ts';

// Extended interface for network resources with server location data
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
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { MODAL_KEY_OPEN, RESOURCE_CLASS } from '@/app/constants/app-texts';
import { BugIcon, CredentialIcon, DocumentIcon, TrashIcon, PlusIcon, SearchIcon } from '@icons';
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
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(1);

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

  // Filter resources based on search term
  const filteredResources = useMemo(() => {
    if (!searchTerm.trim()) {
      return internalNetwork;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    
    return internalNetwork.filter((resource) => {
      // Search by Server IP
      const serverIP = resource.device_ex_address || resource.device_in_address || '';
      if (serverIP.toLowerCase().includes(searchLower)) {
        return true;
      }

      // Search by domains in all_found_domains
      try {
        const domains = JSON.parse(resource.all_found_domains || '[]');
        return domains.some((domain: string) => 
          domain.toLowerCase().includes(searchLower)
        );
      } catch {
        return false;
      }
    });
  }, [internalNetwork, searchTerm]);

  // Calculate column count based on container width
  useEffect(() => {
    const updateColumnCount = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth - 32; // padding
        const cardWidth = 350; // min card width
        const gap = 16; // 1rem gap
        const columns = Math.floor((containerWidth + gap) / (cardWidth + gap));
        setColumnCount(Math.max(1, columns));
      }
    };

    updateColumnCount();
    window.addEventListener('resize', updateColumnCount);
    return () => window.removeEventListener('resize', updateColumnCount);
  }, []);

  // Organize cards into columns for masonry layout
  const organizedColumns = useMemo(() => {
    const columns: NetworkDevice[][] = Array.from({ length: columnCount }, () => []);
    
    filteredResources.forEach((resource, index) => {
      const columnIndex = index % columnCount;
      columns[columnIndex].push(resource);
    });
    
    return columns;
  }, [filteredResources, columnCount]);

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
    <div className="card network-layout">
      {/* Search Bar */}
      <div className="network-search-bar">
        <div className="search-input-container">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search by server IP or domain..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="search-results-info">
          {searchTerm && (
            <span>
              {filteredResources.length} of {internalNetwork.length} resources
            </span>
          )}
        </div>
      </div>

      {/* Cards Container */}
      <div className="network-cards-container" ref={containerRef}>
        {filteredResources.length > 0 ? (
          <div className="masonry-container">
            {organizedColumns.map((column, columnIndex) => (
              <div key={columnIndex} className="masonry-column">
                {column.map((resource) => (
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
            ))}
          </div>
        ) : (
          <div className="no-results">
            {searchTerm ? (
              <>
                <p>No resources found matching "{searchTerm}"</p>
                <p>Try searching by server IP or domain name</p>
              </>
            ) : (
              <p>No network resources available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 