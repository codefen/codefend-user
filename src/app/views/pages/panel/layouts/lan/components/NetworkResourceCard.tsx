import { type FC, useState, useEffect, useRef } from 'react';
import type { Device } from '@interfaces/panel.ts';
import {
  BugIcon,
  CredentialIcon,
  DocumentIcon,
  TrashIcon,
  PlusIcon,
  ChevronIcon,
  ThreeDotsVerticalIcon,
  LocationOutlineIcon,
} from '@icons';
import './network-cards.scss';

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

interface NetworkResourceCardProps {
  resource: NetworkDevice;
  onViewReport: (resource: NetworkDevice) => void;
  onViewCredentials: (resource: NetworkDevice) => void;
  onDelete: (resource: NetworkDevice) => void;
  onAddIssue: (resource: NetworkDevice) => void;
  onAddSubNetwork: (resource: NetworkDevice) => void;
  canDelete: boolean;
  canAddIssue: boolean;
  canAddSubNetwork: boolean;
  hasIssues: boolean;
  onThreeDotsClick: (event: React.MouseEvent, resource: NetworkDevice) => void;
}

export const NetworkResourceCard: FC<NetworkResourceCardProps> = ({
  resource,
  onViewReport,
  onViewCredentials,
  onDelete,
  onAddIssue,
  onAddSubNetwork,
  canDelete,
  canAddIssue,
  canAddSubNetwork,
  hasIssues,
  onThreeDotsClick,
}) => {
  const [showActions, setShowActions] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Close actions menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setShowActions(false);
      }
    };

    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActions]);

  // Parse the all_found_domains JSON string
  const parseDomains = (domainsString: string): string[] => {
    try {
      return JSON.parse(domainsString || '[]');
    } catch {
      return [];
    }
  };

  const domains = parseDomains(resource.all_found_domains || '');
  const hasSubNetwork = !!resource.resource_lan_dad;

  // Check if country code is valid for flag display
  const hasValidCountryCode = (countryCode: string | undefined): boolean => {
    return Boolean(countryCode && countryCode.length === 2);
  };

  const formatLocation = () => {
    const parts = [
      resource.server_pais,
      resource.server_pais_provincia,
      resource.server_pais_ciudad,
    ].filter(Boolean);

    return parts.join(', ') || 'Unknown location';
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowActions(!showActions);
  };

  const handleThreeDotsButtonClick = (e: React.MouseEvent) => {
    onThreeDotsClick(e, resource);
  };

  return (
    <div
      ref={cardRef}
      className={`network-resource-card ${hasSubNetwork ? 'sub-network' : ''} ${showActions ? 'actions-visible' : ''}`}
      onContextMenu={handleContextMenu}>
      {/* Header */}
      <div className="card-header">
        <div className="server-info">
          <span className="server-ip">
            <strong>Server IP:</strong>{' '}
            {resource.device_ex_address || resource.device_in_address || 'N/A'}
          </span>
          <span className="country-flag">
            {hasValidCountryCode(resource.server_pais_code) ? (
              <span className={`flag flag-${resource.server_pais_code?.toLowerCase?.()}`}></span>
            ) : (
              <span>🌍</span>
            )}
          </span>
          <div className="resource-id">ID: {resource.id}</div>
        </div>
        <button className="action-button" onClick={handleThreeDotsButtonClick}>
          <ThreeDotsVerticalIcon />
        </button>
      </div>

      {/* Location */}
      <div className="server-location">
        <LocationOutlineIcon /> {formatLocation()}
      </div>

      {/* Found Web Apps */}
      <div className="found-apps">
        <div className="apps-title">
          {resource.all_found_domains_value
            ? `${resource.all_found_domains_value} domains resolve here:`
            : 'Found web apps:'}
        </div>
        {domains.length > 0 ? (
          <ul className="apps-list">
            {domains.map((domain, index) => (
              <li key={index} className="app-item">
                <span className="domain-resolve-icon"></span> {domain}
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-apps">No web applications found</div>
        )}
      </div>
    </div>
  );
};
