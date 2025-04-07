import { useUserLocationStore } from '@stores/useLocation.store';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

const ALLOWED_PATHS = ['/auth/signup'];

export function useUserLocation() {
  const { setData, country: storedCountry, region: storedRegion } = useUserLocationStore();

  useEffect(() => {
    // Validamos si estamos en una ruta habilitada
    const currentPath = window?.location?.pathname;
    const isAllowedPath = ALLOWED_PATHS.includes(currentPath);

    if (!isAllowedPath) return;

    fetch('https://ipinfo.io/json?token=6378a34c5dd63c')
      .then(response => response.json())
      .then(data => {
        const newCountry = data?.country;
        const newRegion = data?.region;

        // Solo actualizamos si los valores realmente cambiaron
        const hasCountryChanged = newCountry && newCountry !== storedCountry;
        const hasRegionChanged = newRegion && newRegion !== storedRegion;

        if (hasCountryChanged || hasRegionChanged) {
          setData({
            country: newCountry,
            city: data?.city,
            region: newRegion,
          });
        }
      })
      .catch(error => {
        console.error('Error obteniendo la ubicación:', error);
      });
  }, [setData, storedCountry, storedRegion]);
}
