import { type FC } from 'react';
import { PrimaryButton } from '@/app/views/components/buttons/primary/PrimaryButton';
import { CheckCircleIcon, CloseIcon } from '@icons';
import Show from '@/app/views/components/Show/Show';
import './CompanyDeletionResultModal.scss';

interface DeletionSummary {
  [tableName: string]: number;
}

interface CompanyDeletionResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  companyId: string | number;
  deletionSummary: DeletionSummary;
  totalRecordsDeleted: number;
}

// Mapeo de nombres de tablas a nombres amigables en español
const TABLE_NAMES_MAP: { [key: string]: string } = {
  companies: 'empresas',
  users: 'usuarios',
  communiques: 'comunicados',
  console: 'registros de consola',
  creds: 'credenciales',
  cs: 'tickets de soporte',
  issues: 'issues de seguridad',
  issues_cs: 'conversaciones de issues',
  llm_provokes: 'consultas LLM',
  orders: 'órdenes',
  orders_reviews: 'reviews de órdenes',
  resources_cloud: 'recursos cloud',
  resources_end: 'recursos endpoint',
  resources_lan: 'recursos LAN',
  resources_mobile: 'recursos móviles',
  resources_social: 'recursos sociales',
  resources_source: 'recursos de código fuente',
  resources_web: 'recursos web',
  scans_neuroscan: 'escaneos neuroscan',
  users_invokes: 'invocaciones de usuario',
  users_providers: 'proveedores de usuario',
  xfers: 'transferencias',
};

const CompanyDeletionResultModal: FC<CompanyDeletionResultModalProps> = ({
  isOpen,
  onClose,
  companyName,
  companyId,
  deletionSummary,
  totalRecordsDeleted,
}) => {
  if (!isOpen) return null;

  // Filtrar solo las tablas que tuvieron eliminaciones
  const deletedItems = Object.entries(deletionSummary).filter(([_, count]) => count > 0);

  return (
    <div className="company-deletion-modal-overlay">
      <div className="company-deletion-modal">
        <div className="company-deletion-modal-header">
          <div className="success-icon">
            <CheckCircleIcon />
          </div>
          <button className="close-button" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="company-deletion-modal-content">
          <h2 className="modal-title">Empresa eliminada correctamente</h2>
          
          <div className="company-info">
            <p className="company-details">
              Se ha eliminado correctamente la empresa <strong>{companyName}</strong> con el ID: <strong>{companyId}</strong>
            </p>
          </div>

          <div className="deletion-summary">
            <h3 className="summary-title">Resumen de eliminaciones:</h3>
            <div className="deletion-list">
              <Show when={deletedItems.length > 0}>
                {deletedItems.map(([tableName, count]) => (
                  <div key={tableName} className="deletion-item">
                    <span className="count">{count}</span>
                    <span className="description">
                      {TABLE_NAMES_MAP[tableName] || tableName} eliminados
                    </span>
                  </div>
                ))}
              </Show>
              
              <Show when={deletedItems.length === 0}>
                <div className="deletion-item">
                  <span className="count">0</span>
                  <span className="description">No se encontraron registros para eliminar</span>
                </div>
              </Show>
            </div>

            <div className="total-summary">
              <div className="total-line">
                <span className="total-label">Total de registros eliminados:</span>
                <span className="total-count">{totalRecordsDeleted}</span>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <PrimaryButton
              text="Aceptar"
              click={onClose}
              className="accept-button"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDeletionResultModal; 