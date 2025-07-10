import { toast as reactToast } from 'react-toastify';
import type { ToastContent, ToastOptions, Id } from 'react-toastify';

// Mapa para rastrear toasts activos por mensaje
const activeToasts = new Map<string, Id>();

interface CustomToastOptions extends ToastOptions {
  preventDuplicate?: boolean;
}

/**
 * Crea una clave única para identificar toasts similares
 */
const createToastKey = (content: ToastContent, type: string): string => {
  const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
  return `${type}:${contentStr}`;
};

/**
 * Limpia un toast del registro cuando se cierra
 */
const cleanupToast = (key: string) => {
  activeToasts.delete(key);
};

/**
 * Muestra un toast solo si no hay uno idéntico activo
 */
const showToastIfNotDuplicate = (
  content: ToastContent,
  type: 'success' | 'error' | 'warning' | 'info',
  options: CustomToastOptions = {}
): Id | null => {
  const { preventDuplicate = true, ...toastOptions } = options;

  if (!preventDuplicate) {
    // Si no se quiere prevenir duplicados, mostrar directamente
    return reactToast[type](content, toastOptions);
  }

  const key = createToastKey(content, type);

  // Verificar si ya existe un toast idéntico
  if (activeToasts.has(key)) {
    console.log(`Toast duplicado evitado: ${key}`);
    return null;
  }

  // Mostrar el toast y registrarlo
  const toastId = reactToast[type](content, {
    ...toastOptions,
    onClose: () => {
      cleanupToast(key);
      if (toastOptions.onClose) {
        toastOptions.onClose();
      }
    },
  });

  // Registrar el toast activo
  activeToasts.set(key, toastId);

  return toastId;
};

/**
 * Toast personalizado que evita duplicados
 */
export const toast = {
  /**
   * Muestra un toast de éxito
   */
  success: (content: ToastContent, options?: CustomToastOptions) => {
    return showToastIfNotDuplicate(content, 'success', options);
  },

  /**
   * Muestra un toast de error
   */
  error: (content: ToastContent, options?: CustomToastOptions) => {
    return showToastIfNotDuplicate(content, 'error', options);
  },

  /**
   * Muestra un toast de advertencia
   */
  warning: (content: ToastContent, options?: CustomToastOptions) => {
    return showToastIfNotDuplicate(content, 'warning', options);
  },

  /**
   * Alias para warning (compatibilidad con react-toastify)
   */
  warn: (content: ToastContent, options?: CustomToastOptions) => {
    return showToastIfNotDuplicate(content, 'warning', options);
  },

  /**
   * Muestra un toast informativo
   */
  info: (content: ToastContent, options?: CustomToastOptions) => {
    return showToastIfNotDuplicate(content, 'info', options);
  },

  /**
   * Fuerza mostrar un toast sin verificar duplicados
   */
  force: {
    success: (content: ToastContent, options?: ToastOptions) =>
      reactToast.success(content, options),
    error: (content: ToastContent, options?: ToastOptions) => reactToast.error(content, options),
    warning: (content: ToastContent, options?: ToastOptions) =>
      reactToast.warning(content, options),
    warn: (content: ToastContent, options?: ToastOptions) => reactToast.warning(content, options),
    info: (content: ToastContent, options?: ToastOptions) => reactToast.info(content, options),
  },

  /**
   * Cierra un toast específico
   */
  dismiss: (toastId?: Id) => {
    reactToast.dismiss(toastId);
  },

  /**
   * Cierra todos los toasts
   */
  dismissAll: () => {
    activeToasts.clear();
    reactToast.dismiss();
  },

  /**
   * Verifica si un toast está activo
   */
  isActive: (content: ToastContent, type: string): boolean => {
    const key = createToastKey(content, type);
    return activeToasts.has(key);
  },

  /**
   * Obtiene información sobre toasts activos (para debugging)
   */
  getActiveToasts: () => {
    return Array.from(activeToasts.keys());
  },

  /**
   * Limpia el registro de toasts activos (útil para testing)
   */
  clearRegistry: () => {
    activeToasts.clear();
  },
};

export default toast;
