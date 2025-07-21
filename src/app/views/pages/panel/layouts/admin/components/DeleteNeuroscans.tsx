import { PrimaryButton } from '@/app/views/components/buttons/primary/PrimaryButton';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import { toast } from 'react-toastify';

export function DeleteNeuroscans() {
  const { company } = useGlobalFastFields(['company']);
  const http = AxiosHttpService.getInstance();

  const handleDelete = () => {
    // ❌ FUNCIONALIDAD DESACTIVADA POR SEGURIDAD
    toast.warning('⚠️ Esta funcionalidad está temporalmente desactivada por seguridad.');
    return;
    
    // Código original comentado por seguridad
    // if (window.confirm('Are you sure you want to delete all neuroscans? This action cannot be undone.')) {
    //   const payload = {
    //     model: 'admin/neuroscans_del',
    //     company_id: company.get.id,
    //   };

    //   http.post({ body: payload })
    //     .then((res: any) => {
    //       if (res.data.response === 'success') {
    //         const deletedCount = res.data.deleted_records_count || 0;
    //         const message = `All neuroscans have been deleted. ${deletedCount} record directories removed.`;
    //         toast.success(message);
    //       } else {
    //         toast.error('An error occurred while deleting neuroscans.');
    //       }
    //     })
    //     .catch((err) => {
    //       console.error(err);
    //       toast.error('An error occurred. Please check the console for details.');
    //     });
    // }
  };

  return (
    <div className="card disabled-card">
      <div className="over">
        <div className="header">
          <h2 className="table-title" style={{ color: '#999', opacity: 0.7 }}>
            ⚠️ Eliminar todos los neuroscans
          </h2>
        </div>
        <p style={{ color: '#666', opacity: 0.8 }}>
          Elimina (de verdad) todos los neuroscans, incluyendo, el neuroscan en
          sí, los recursos web, recursos sociales, recursos de red e issues
          relacionados, elimina los archivos del fs.
        </p>
        <div style={{ opacity: 0.5 }}>
          <PrimaryButton
            click={handleDelete}
            text="🚫 Desactivado"
            buttonStyle="gray"
            className="form-button disabled-button"
            isDisabled={true}
          />
        </div>
        <div style={{ 
          marginTop: '10px', 
          padding: '8px 12px', 
          background: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          borderRadius: '4px', 
          color: '#856404',
          fontSize: '0.85rem'
        }}>
          ⚠️ <strong>Funcionalidad desactivada:</strong> Esta acción está temporalmente deshabilitada por razones de seguridad.
        </div>
      </div>
    </div>
  );
} 