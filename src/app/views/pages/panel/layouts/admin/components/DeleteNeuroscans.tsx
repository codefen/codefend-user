import { PrimaryButton } from '@/app/views/components/buttons/primary/PrimaryButton';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import { toast } from 'react-toastify';

export function DeleteNeuroscans() {
  const { company } = useGlobalFastFields(['company']);
  const http = AxiosHttpService.getInstance();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete all neuroscans? This action cannot be undone.')) {
      const payload = {
        model: 'admin/neuroscans_del',
        company_id: company.get.id,
      };

      http.post({ body: payload })
        .then((res: any) => {
          if (res.data.response === 'success') {
            const deletedCount = res.data.deleted_records_count || 0;
            const message = `All neuroscans have been deleted. ${deletedCount} record directories removed.`;
            toast.success(message);
          } else {
            toast.error('An error occurred while deleting neuroscans.');
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error('An error occurred. Please check the console for details.');
        });
    }
  };

  return (
    <div className="card">
      <div className="over">
        <div className="header">
          <h2 className="table-title">Eliminar todos los neuroscans</h2>
        </div>
        <p>
          Elimina (de verdad) todos los neuroscans, incluyendo, el neuroscan en
          sí, los recursos web, recursos sociales, recursos de red e issues
          relacionados, elimina los archivos del fs.
        </p>
        <PrimaryButton
          click={handleDelete}
          text="Eliminar"
          buttonStyle="red"
          className="form-button"
        />
      </div>
    </div>
  );
} 