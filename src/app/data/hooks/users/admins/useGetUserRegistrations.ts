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

type TimePeriod = 'today' | 'week' | '14days' | '21days';

export const useGetUserRegistrations = () => {
  const { getCompany } = useUserData();
  const [data, setData] = useState<DailyData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState<TimePeriod>('today');
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

  // Filtrar según el período seleccionado (ya no necesario, se hace en backend)
  const processDataByPeriod = (combinedData: DailyData[]) => {
    return combinedData.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  };

  const fetchRegistrations = useCallback(
    async (period: TimePeriod) => {
      if (isLoading) return; // Evitar requests duplicados

      // console.log(`🔄 Fetching data for period: ${period}`);

      setIsLoading(true);
      setCurrentPeriod(period);

      try {
        const response = await AxiosHttpService.getInstance().post<any>({
          path: 'admin/users/flow',
          body: {
            company_id: getCompany(),
            period: period,
          },
          requireSession: true,
        });

        if (response.data?.error === '0') {
          // console.log(`✅ Data received for period: ${period}`, response.data);

          const combinedData = combineDataByDate(response.data);
          const processedData = processDataByPeriod(combinedData);

          // Calcular totales
          const newTotals = {
            leads: processedData.reduce((sum, reg) => sum + parseInt(reg.leads || '0'), 0),
            usuarios: processedData.reduce((sum, reg) => sum + parseInt(reg.usuarios || '0'), 0),
            companias: processedData.reduce((sum, reg) => sum + parseInt(reg.companias || '0'), 0),
            neuroscans: processedData.reduce(
              (sum, reg) => sum + parseInt(reg.neuroscans || '0'),
              0
            ),
            issues_vistos: processedData.reduce(
              (sum, reg) => sum + parseInt(reg.issues_vistos || '0'),
              0
            ),
            visitas_unicas: processedData.reduce(
              (sum, reg) => sum + parseInt(reg.visitas_unicas || '0'),
              0
            ),
            orders: processedData.reduce((sum, reg) => sum + parseInt(reg.orders || '0'), 0),
          };

          // console.log(
          //   `📊 Processed ${processedData.length} records for period: ${period}`,
          //   newTotals
          // );

          setData(processedData);
          setTotals(newTotals);
        } else {
          console.error(`❌ Error response for period: ${period}`, response.data);
          toast.error('Error al cargar los datos');
          setData([]);
          setTotals({
            leads: 0,
            usuarios: 0,
            companias: 0,
            neuroscans: 0,
            issues_vistos: 0,
            visitas_unicas: 0,
            orders: 0,
          });
        }
      } catch (error) {
        console.error(`❌ Network error for period: ${period}`, error);
        const errorMessage = apiErrorValidation(error);
        toast.error(errorMessage || 'Error al cargar los datos');
        setData([]);
        setTotals({
          leads: 0,
          usuarios: 0,
          companias: 0,
          neuroscans: 0,
          issues_vistos: 0,
          visitas_unicas: 0,
          orders: 0,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [getCompany]
  ); // Removí currentPeriod de las dependencias para evitar la dependencia circular

  return {
    data,
    totals,
    isLoading,
    currentPeriod,
    fetchRegistrations,
  };
};
