import { useUserData } from '#commonUserHooks/useUserData';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import { useState, useCallback } from 'react';
import { apiErrorValidation } from '@/app/constants/validations';
import { toast } from '@/app/data/utils';

interface DailyData {
  fecha: string;
  leads: string;
  usuarios: string;
  companias: string;
  neuroscans: string;
  visitas_unicas: string;
  orders: string;
  issues_vistos: string;
}

export const useGetUserRegistrations = () => {
  const { getCompany } = useUserData();
  const [data, setData] = useState<DailyData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totals, setTotals] = useState({
    leads: 0,
    usuarios: 0,
    companias: 0,
    neuroscans: 0,
    issues_vistos: 0,
    visitas_unicas: 0,
    orders: 0,
  });

  // Combinar todos los datos por fecha
  const combineDataByDate = (responseData: any) => {
    const dateMap = new Map<string, DailyData>();
    
    // Procesar cada tipo de dato
    const dataTypes = [
      { key: 'leads_por_dia', field: 'leads' },
      { key: 'usuarios_por_dia', field: 'usuarios' },
      // { key: 'companias_por_dia', field: 'companias' }, // Comentado - no se muestra por defecto
      // { key: 'neuroscans_por_dia', field: 'neuroscans' }, // Comentado - no se muestra por defecto
      { key: 'visitas_unicas_por_dia', field: 'visitas_unicas' },
      { key: 'orders_por_dia', field: 'orders' },
      { key: 'issues_vistos_por_dia', field: 'issues_vistos' },
    ];

    dataTypes.forEach(({ key, field }) => {
      const records = responseData[key] || [];
      records.forEach((record: { fecha: string; volumen: string }) => {
        if (!dateMap.has(record.fecha)) {
          dateMap.set(record.fecha, {
            fecha: record.fecha,
            leads: '0',
            usuarios: '0',
            companias: '0',
            neuroscans: '0',
            visitas_unicas: '0',
            orders: '0',
            issues_vistos: '0',
          });
        }
        const existing = dateMap.get(record.fecha)!;
        existing[field as keyof DailyData] = record.volumen;
      });
    });

    return Array.from(dateMap.values());
  };

  // Filtrar los últimos 30 días
  const filterLast30Days = (combinedData: DailyData[]) => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    return combinedData
      .filter(reg => {
        const regDate = new Date(reg.fecha);
        return regDate >= thirtyDaysAgo && regDate <= today;
      })
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  };

  const fetchRegistrations = useCallback(async () => {
    if (isLoading) return; // Evitar requests duplicados
    
    setIsLoading(true);
    
    try {
      const response = await AxiosHttpService.getInstance().post<any>({
        path: 'admin/users/flow',
        body: { company_id: getCompany() },
        requireSession: true,
      });

      if (response.data?.error === '0') {
        const combinedData = combineDataByDate(response.data);
        const filteredData = filterLast30Days(combinedData);
        
        // Calcular totales
        const newTotals = {
          leads: filteredData.reduce((sum, reg) => sum + parseInt(reg.leads || '0'), 0),
          usuarios: filteredData.reduce((sum, reg) => sum + parseInt(reg.usuarios || '0'), 0),
          companias: filteredData.reduce((sum, reg) => sum + parseInt(reg.companias || '0'), 0),
          neuroscans: filteredData.reduce((sum, reg) => sum + parseInt(reg.neuroscans || '0'), 0),
          issues_vistos: filteredData.reduce((sum, reg) => sum + parseInt(reg.issues_vistos || '0'), 0),
          visitas_unicas: filteredData.reduce((sum, reg) => sum + parseInt(reg.visitas_unicas || '0'), 0),
          orders: filteredData.reduce((sum, reg) => sum + parseInt(reg.orders || '0'), 0),
        };
        
        setData(filteredData);
        setTotals(newTotals);
        // toast.success('Datos cargados correctamente'); // Removido para carga automática
      } else {
        toast.error('Error al cargar los datos');
        setData([]);
        setTotals({ leads: 0, usuarios: 0, companias: 0, neuroscans: 0, issues_vistos: 0, visitas_unicas: 0, orders: 0 });
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
      const errorMessage = apiErrorValidation(error);
      toast.error(errorMessage || 'Error al cargar los datos');
      setData([]);
      setTotals({ leads: 0, usuarios: 0, companias: 0, neuroscans: 0, issues_vistos: 0, visitas_unicas: 0, orders: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [getCompany]);

  return {
    data,
    totals,
    isLoading,
    fetchRegistrations,
  };
}; 