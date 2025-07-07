import { useUserData } from '#commonUserHooks/useUserData';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import { toast } from 'react-toastify';
import { useCallback } from 'react';
import { mutate } from 'swr';

export const useDeleteCompany = () => {
  const { logout } = useUserData();
  const { session } = useGlobalFastFields(['session']);

  const deleteCompany = useCallback(
    async (companyId: string | number) => {
      try {
        const response = await AxiosHttpService.getInstance().post({
          body: {
            model: 'admin/erase_company',
            company_id: companyId,
            session: session.get,
          },
        }) as any;

        if (response.data.error === '0') {
          toast.success(
            `Company "${response.data.company_name}" deleted successfully. ${response.data.total_records_deleted} records removed.`
          );
          // Invalidar cache de companies para refrescar la lista
          await mutate('companies/index');
          return true;
        } else {
          toast.error(response.data.info || 'Error deleting company');
          return false;
        }
      } catch (error) {
        console.error('Error deleting company:', error);
        toast.error('Error deleting company');
        return false;
      }
    },
    [session, logout]
  );

  return {
    deleteCompany,
  };
}; 