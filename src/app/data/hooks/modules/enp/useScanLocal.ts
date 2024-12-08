import { useCallback, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

// Hook para manejar el escaneo local
export const useScanLocal = (token: string) => {
  const [scanLoading, setScanLoading] = useState(false);
  const navigate = useNavigate();

  const handleScanResult = (result: any) => {
    if (result.success) {
      return true;
    }
    return false;
  };

  const scanLocal = useCallback(async () => {
    setScanLoading(true);
    try {
      const resParsed = JSON.parse(await invoke('scan_local', { sessionId: token }));
      return handleScanResult(resParsed);
    } catch (error: any) {
      toast.error(JSON.parse(error).error);
    } finally {
      setScanLoading(false);
      navigate(0);
    }
    return false;
  }, [token, handleScanResult]);

  return { scanLoading, scanLocal };
};
