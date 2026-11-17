import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { useEffect } from 'react';

const ALLOWED_PATHS = ['/user/new', '/user/access', '/auth/signup/invitation'];

export function useUserLocation() {
  const stored = useGlobalFastFields(['city', 'country', 'region']);

  useEffect(() => {
    // Validamos si estamos en una ruta habilitada
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    const currentPath = window.location.pathname.replace(new RegExp(`^${base}(?=/|$)`), '') || '/';
    const isAllowedPath =
      ALLOWED_PATHS.includes(currentPath) || currentPath.startsWith('/auth/signup/invitation');
    if (!isAllowedPath) return;
    fetch('https://ipinfo.io/json?token=6378a34c5dd63c')
      .then(response => response.json())
      .then(data => {
        const newCountry = data?.country;
        const newRegion = data?.region;

        // Solo actualizamos si los valores realmente cambiaron
        const hasCountryChanged = newCountry && newCountry !== stored.country;
        const hasRegionChanged = newRegion && newRegion !== stored.region;

        if (hasCountryChanged || hasRegionChanged) {
          stored.country.set(newCountry);
          stored.region.set(newRegion);
          stored.city.set(data?.city);
        }
      })
      .catch(error => {
        console.error('Error obteniendo la ubicación:', error);
      });
  }, [window?.location?.pathname]);
}
