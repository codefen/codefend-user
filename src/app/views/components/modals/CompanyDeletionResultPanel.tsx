import { type FC, useEffect, useRef, useState } from 'react';
import { PrimaryButton } from '@/app/views/components/buttons/primary/PrimaryButton';
import { CheckCircleIcon, CloseIcon } from '@icons';
import Show from '@/app/views/components/Show/Show';
import './CompanyDeletionResultPanel.scss';

interface DeletionSummary {
  [tableName: string]: number;
}

interface CompanyDeletionResultPanelProps {
  panelId: string;
  stackIndex: number;
  totalPanels: number; // Nuevo prop para mostrar posición
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

const CompanyDeletionResultPanel: FC<CompanyDeletionResultPanelProps> = ({
  panelId,
  stackIndex,
  totalPanels,
  onClose,
  companyName,
  companyId,
  deletionSummary,
  totalRecordsDeleted,
}) => {
  // Estados para el auto-cierre
  const [isClosing, setIsClosing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [progressWidth, setProgressWidth] = useState(100);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Función para iniciar la barra de progreso
  const startProgressBar = () => {
    setProgressWidth(100);
    const startTime = Date.now();
    const duration = 3000; // 3 segundos
    
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      const widthPercentage = (remaining / duration) * 100;
      
      setProgressWidth(widthPercentage);
      
      if (remaining <= 0) {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      }
    }, 50); // Actualizar cada 50ms para animación suave
  };

  // Función para parar la barra de progreso
  const stopProgressBar = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setProgressWidth(100); // Resetear al 100%
  };

  // Función para iniciar el timer de auto-cierre
  const startAutoCloseTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    startProgressBar();
    
    timeoutRef.current = setTimeout(() => {
      console.log(`⏰ Auto-cerrando panel ${panelId}`);
      setIsClosing(true);
      // Esperar a que termine la animación de fadeout antes de cerrar
      setTimeout(() => {
        onClose();
      }, 500); // 500ms para la animación de fadeout
    }, 3000); // 3 segundos
  };

  // Función para parar el timer
  const stopAutoCloseTimer = () => {
    if (timeoutRef.current) {
      console.log(`⏸️ Pausando auto-cierre para panel ${panelId}`);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    stopProgressBar();
  };

  // Efecto para iniciar el timer cuando se monta el componente
  useEffect(() => {
    console.log(`🚀 Iniciando timer de auto-cierre para panel ${panelId}`);
    startAutoCloseTimer();
    
    // Limpiar timeouts al desmontar
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Manejar hover
  const handleMouseEnter = () => {
    console.log(`🖱️ Mouse encima del panel ${panelId} - pausando auto-cierre`);
    setIsHovered(true);
    stopAutoCloseTimer();
  };

  const handleMouseLeave = () => {
    console.log(`🖱️ Mouse fuera del panel ${panelId} - reanudando auto-cierre en 3s`);
    setIsHovered(false);
    startAutoCloseTimer();
  };

  // Filtrar solo las tablas que tuvieron eliminaciones
  const deletedItems = Object.entries(deletionSummary).filter(([_, count]) => count > 0);

  // Calcular posición vertical basada en el stackIndex
  // Cada panel tiene aproximadamente 280px de altura + 10px de separación
  const PANEL_HEIGHT = 280;
  const PANEL_SPACING = 10;
  const topPosition = 20 + (stackIndex * (PANEL_HEIGHT + PANEL_SPACING));

  return (
    <div 
      className={`company-deletion-panel ${isClosing ? 'closing' : ''}`}
      style={{
        top: `${topPosition}px`,
        right: '20px', // Siempre pegado a la derecha
        transition: 'top 0.3s ease, opacity 0.5s ease-out, transform 0.3s ease',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Barra de progreso para auto-cierre */}
      {!isHovered && !isClosing && (
        <div className="auto-close-progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressWidth}%` }}
          />
        </div>
      )}

      <div className="company-deletion-panel-header">
        <div className="success-icon">
          <CheckCircleIcon />
        </div>
        
        {/* Indicador de posición en la pila */}
        {totalPanels > 1 && (
          <div className="panel-position-indicator">
            {stackIndex + 1}/{totalPanels}
          </div>
        )}
        
        <button className="close-button" onClick={onClose}>
          <CloseIcon />
        </button>
      </div>

      <div className="company-deletion-panel-content">
        <h3 className="panel-title">Empresa eliminada</h3>
        
        <div className="company-info">
          <p className="company-details">
            <strong>{companyName}</strong> (ID: {companyId})
          </p>
        </div>

        <div className="deletion-summary">
          <h4 className="summary-title">Resumen:</h4>
          <div className="deletion-list">
            <Show when={deletedItems.length > 0}>
              {deletedItems.map(([tableName, count]) => (
                <div key={tableName} className="deletion-item">
                  <span className="count">{count}</span>
                  <span className="description">
                    {TABLE_NAMES_MAP[tableName] || tableName}
                  </span>
                </div>
              ))}
            </Show>
            
            <Show when={deletedItems.length === 0}>
              <div className="deletion-item">
                <span className="count">0</span>
                <span className="description">Sin registros</span>
              </div>
            </Show>
          </div>

          <div className="total-summary">
            <div className="total-line">
              <span className="total-label">Total eliminados:</span>
              <span className="total-count">{totalRecordsDeleted}</span>
            </div>
          </div>
        </div>

        <div className="panel-actions">
          <PrimaryButton
            text="Cerrar"
            click={onClose}
            className="close-panel-button"
            buttonStyle="red"
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyDeletionResultPanel; 