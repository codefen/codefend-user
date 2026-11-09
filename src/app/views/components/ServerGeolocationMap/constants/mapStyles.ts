// =============================
// 🎨 VARIABLES DE ESTÉTICA Y ANIMACIÓN (EDITAR AQUÍ)
// =============================
export const MAP_STYLE = {
  // Colores de países
  countryNoData: '#eee', // Países sin datos
  darkCountryNoData: '#52636a',
  countryTop: '#333', // País #1 con más servidores
  darkCountryTop: '#bcebf6',
  countryBase: '#333', // Color base para el gradiente de países
  darkCountryBase: '#a5dfee',

  // Bordes de países
  countryBorder: '#ccc',
  darkCountryBorder: '#74878e',
  countryBorderWidth: 0.2,

  // Fondo de agua (globo)
  oceanCenter: '#fff', // Centro del océano (blanco puro)
  darkOceanCenter: '#202b30',
  oceanEdge: '#fefefe', // Bordes del océano (gris muy claro)
  darkOceanEdge: '#171f23',
  globeBorder: '#e5e7eb', // Borde del globo (gris claro)
  darkGlobeBorder: '#63777e',

  globeBorderWidth: 1,

  // Grilla (meridianos/paralelos)
  graticule3D: '#788d95',
  graticule2D: '#e0e0e0',
  graticuleWidth3D: 0.3,
  graticuleWidth2D: 0.5,
  graticuleOpacity: 0.3,

  // Zoom y animación
  zoomInScale: 2.0,
  zoomOutScale: 1.0,
  zoomInDuration: 2000, // ms
  zoomOutDuration: 1000, // ms
  rotateDuration: 2000, // ms
  rotateFirstDuration: 1500, // ms
  autoRotateInterval: 4000, // ms
  autoRotateIntervalShort: 2000, // ms
} as const;

export default MAP_STYLE;
