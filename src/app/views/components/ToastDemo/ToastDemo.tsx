import { useState } from 'react';
import { toast } from '@/app/data/utils';

/**
 * Componente de demostración para el sistema anti-duplicados de toast
 * Úsalo para testing o para mostrar a otros desarrolladores cómo funciona
 */
export const ToastDemo = () => {
  const [counter, setCounter] = useState(0);

  const handleDuplicateError = () => {
    // Esto solo mostrará un toast, no importa cuántas veces se haga clic
    toast.error('Este es un error que se puede repetir');
    setCounter(prev => prev + 1);
  };

  const handleForcedError = () => {
    // Esto siempre mostrará un toast nuevo
    toast.force.error('Este error siempre se muestra');
  };

  const handleDifferentMessages = () => {
    // Estos son mensajes diferentes, así que se mostrarán todos
    toast.info(`Mensaje único #${Date.now()}`);
  };

  const handleSameMessageDifferentTypes = () => {
    // Estos tienen el mismo mensaje pero diferentes tipos, así que se mostrarán ambos
    toast.success('El mismo mensaje');
    toast.error('El mismo mensaje');
    toast.warning('El mismo mensaje');
  };

  const handleClearAll = () => {
    toast.dismissAll();
    setCounter(0);
  };

  const handleShowDebugInfo = () => {
    const activeToasts = toast.getActiveToasts();
    // console.log('🔍 Toasts activos:', activeToasts);
    toast.info(`Toasts activos: ${activeToasts.length}`);
  };

  return (
    <div
      style={{
        padding: '20px',
        border: '2px solid #ddd',
        borderRadius: '8px',
        margin: '20px',
        backgroundColor: '#f9f9f9',
      }}>
      <h3>🧪 Demo: Sistema Anti-Duplicados de Toast</h3>
      <p>Usa estos botones para probar el sistema:</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
        <button
          onClick={handleDuplicateError}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}>
          Error Duplicado (clicks: {counter})
        </button>

        <button
          onClick={handleForcedError}
          style={{
            padding: '8px 16px',
            backgroundColor: '#e17055',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}>
          Error Forzado (siempre aparece)
        </button>

        <button
          onClick={handleDifferentMessages}
          style={{
            padding: '8px 16px',
            backgroundColor: '#74b9ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}>
          Mensaje Único
        </button>

        <button
          onClick={handleSameMessageDifferentTypes}
          style={{
            padding: '8px 16px',
            backgroundColor: '#a29bfe',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}>
          Mismo mensaje, diferentes tipos
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={handleClearAll}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}>
          Limpiar Todos
        </button>

        <button
          onClick={handleShowDebugInfo}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}>
          Ver Debug Info
        </button>
      </div>

      <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
        <h4>🎯 Qué probar:</h4>
        <ul>
          <li>
            <strong>Error Duplicado:</strong> Haz clic múltiples veces → Solo verás un toast
          </li>
          <li>
            <strong>Error Forzado:</strong> Cada clic → Nuevo toast
          </li>
          <li>
            <strong>Mensaje Único:</strong> Cada clic → Nuevo toast (mensaje único)
          </li>
          <li>
            <strong>Tipos diferentes:</strong> Un toast por cada tipo (success, error, warning)
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ToastDemo;
