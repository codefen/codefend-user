import { useUserLocationStore } from '@stores/useLocation.store';
import { useEffect } from 'react';

export function useUserLocation() {
  const { setData } = useUserLocationStore();

  useEffect(() => {
    // Detectar país del usuario con IPInfo
    fetch('https://ipinfo.io/json?token=6378a34c5dd63c')
      .then(response => response.json())
      .then(data => {
        setData({ country: data.country, city: data.city, region: data.region });
      })
      .catch(error => console.error('Error obteniendo la ubicación:', error));
  }, []);
}
