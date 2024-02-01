import { useCallback } from 'react';
import { Poast } from '../../../../../toastify';

const useTasty = () => {
  const showToast = useCallback((message: any, type: any) => {
    switch (type) {
      case 'success':
        Poast.success(message);
        break;
      case 'error':
        Poast.error(message);
        break;
      case 'info':
        Poast.info(message);
        break;
      default:
        return
    }
  }, []);

  return { showToast };
};

export default useTasty