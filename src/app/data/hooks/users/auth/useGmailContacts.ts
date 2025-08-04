/**
 * Hook para manejar contactos de Gmail
 *
 * Este hook proporciona funcionalidades para obtener, refrescar y
 * gestionar los contactos de Gmail de usuarios registrados con Google OAuth.
 *
 * Funcionalidades:
 * - Obtener contactos almacenados
 * - Refrescar contactos desde Gmail
 * - Estadísticas de contactos (admin)
 *
 * Backend integration:
 * - GET /users/contacts/get (obtener contactos)
 * - POST /users/contacts/refresh (refrescar contactos)
 * - GET /users/contacts/stats (estadísticas - admin)
 *
 * @author Codefend Team
 * @version 1.0
 */

import { useFetcher } from '#commonHooks/useFetcher';
import { useState } from 'react';
import { toast } from '@/app/data/utils';
import { apiErrorValidation } from '@/app/constants/validations';
import { APP_MESSAGE_TOAST } from '@/app/constants/app-toast-texts';

export interface GmailContact {
  resource_name: string;
  name: string;
  emails: string[];
  phones: string[];
  organization: string;
  job_title: string;
}

export const useGmailContacts = () => {
  const [fetcher] = useFetcher();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Obtiene los contactos de Gmail almacenados en la base de datos
   */
  const getContacts = async (): Promise<{
    success: boolean;
    contacts?: GmailContact[];
    total?: number;
    error?: string;
  }> => {
    setIsLoading(true);

    try {
      const { data } = await fetcher('get', {
        body: {
          model: 'users/contacts/get',
        },
      });

      if (apiErrorValidation(data)) {
        throw new Error((data as any)?.info || 'Error al obtener contactos');
      }

      return {
        success: true,
        contacts: (data as any)?.contacts || [],
        total: (data as any)?.total_contacts || 0,
      };
    } catch (error: any) {
      toast.error(error.message || 'Error al obtener contactos de Gmail');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refresca los contactos de Gmail desde la API de Google
   */
  const refreshContacts = async (accessToken: string): Promise<{
    success: boolean;
    contacts?: GmailContact[];
    total?: number;
    error?: string;
  }> => {
    setIsLoading(true);

    try {
      const { data } = await fetcher('post', {
        body: {
          model: 'users/contacts/refresh',
          access_token: accessToken,
        },
      });

      if (apiErrorValidation(data)) {
        throw new Error((data as any)?.info || 'Error al refrescar contactos');
      }

      toast.success('Contactos de Gmail actualizados exitosamente');
      return {
        success: true,
        contacts: (data as any)?.contacts || [],
        total: (data as any)?.total_contacts || 0,
      };
    } catch (error: any) {
      toast.error(error.message || 'Error al refrescar contactos de Gmail');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Obtiene estadísticas de contactos (solo para administradores)
   */
  const getContactsStats = async (): Promise<{
    success: boolean;
    stats?: {
      users_with_contacts: number;
      total_contacts: number;
      avg_contacts_per_user: number;
    };
    error?: string;
  }> => {
    setIsLoading(true);

    try {
      const { data } = await fetcher('get', {
        body: {
          model: 'users/contacts/stats',
        },
      });

      if (apiErrorValidation(data)) {
        throw new Error((data as any)?.info || 'Error al obtener estadísticas');
      }

      return {
        success: true,
        stats: (data as any)?.stats,
      };
    } catch (error: any) {
      toast.error(error.message || 'Error al obtener estadísticas de contactos');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Filtra contactos por criterios específicos
   */
  const filterContacts = (
    contacts: GmailContact[],
    filters: {
      search?: string;
      hasEmail?: boolean;
      hasPhone?: boolean;
      hasOrganization?: boolean;
    }
  ): GmailContact[] => {
    return contacts.filter((contact) => {
      // Filtro de búsqueda por nombre, email o organización
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const nameMatch = contact.name.toLowerCase().includes(searchLower);
        const emailMatch = contact.emails.some(email => 
          email.toLowerCase().includes(searchLower)
        );
        const orgMatch = contact.organization.toLowerCase().includes(searchLower);
        
        if (!nameMatch && !emailMatch && !orgMatch) {
          return false;
        }
      }

      // Filtro por contactos con email
      if (filters.hasEmail && contact.emails.length === 0) {
        return false;
      }

      // Filtro por contactos con teléfono
      if (filters.hasPhone && contact.phones.length === 0) {
        return false;
      }

      // Filtro por contactos con organización
      if (filters.hasOrganization && !contact.organization) {
        return false;
      }

      return true;
    });
  };

  return {
    getContacts,
    refreshContacts,
    getContactsStats,
    filterContacts,
    isLoading,
  };
}; 