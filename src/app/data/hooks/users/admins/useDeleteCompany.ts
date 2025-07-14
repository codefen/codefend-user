import { useUserData } from '#commonUserHooks/useUserData';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import { toast } from 'react-toastify';
import { useCallback } from 'react';
import { mutate } from 'swr';

interface DeletionResult {
  success: boolean;
  companyName?: string;
  companyId?: string | number;
  deletionSummary?: { [tableName: string]: number };
  totalRecordsDeleted?: number;
  error?: string;
}

export const useDeleteCompany = () => {
  const { logout } = useUserData();
  const { session } = useGlobalFastFields(['session']);

  const deleteCompany = useCallback(
    async (companyId: string | number): Promise<DeletionResult> => {
      try {
        const response = await AxiosHttpService.getInstance().post({
          body: {
            model: 'admin/erase_company',
            company_id: companyId,
            session: session.get,
          },
        }) as any;

        if (response.data.error === '0') {
          // Invalidar cache de companies para refrescar la lista
          await mutate('companies/index');
          
          return {
            success: true,
            companyName: response.data.company_name,
            companyId: companyId,
            deletionSummary: response.data.deletion_summary,
            totalRecordsDeleted: response.data.total_records_deleted,
          };
        } else {
          toast.error(response.data.info || 'Error deleting company');
          return {
            success: false,
            error: response.data.info || 'Error deleting company',
          };
        }
      } catch (error) {
        console.error('Error deleting company:', error);
        toast.error('Error deleting company');
        return {
          success: false,
          error: 'Error deleting company',
        };
      }
    },
    [session, logout]
  );

  return {
    deleteCompany,
  };
}; 