/**
 * Funciones para detectar dispositivo y sistema operativo desde User Agent
 */

export interface DeviceInfo {
  // ✅ SISTEMA FLEXIBLE - permite cualquier string
  deviceClass: string; // phone, desk, mid_size, bots, smart_tv, wearable, unknown, etc.
  deviceOs: string;    // windows, macos, linux, ios, android, googlebot, bingbot, facebook, etc.
  deviceIcon: string;
  osIcon: string;
}

/**
 * Detecta la clase de dispositivo (sistema flexible)
 */
export function detectDeviceClass(userAgent: string): string {
  if (!userAgent) return 'unknown';
  
  // 🔥 PRIORIDAD 1: Detectar BOTS primero (igual que backend)
  if (/bot|crawler|spider|scraper|archiver|indexer|fetcher|checker|monitor|validator|test|headless/i.test(userAgent)) {
    return 'bots';
  }
  
  // PRIORIDAD 2: Dispositivos específicos
  if (/iPad/i.test(userAgent)) {
    return 'tablet';
  }
  
  // Android tablet vs phone
  if (/Android/i.test(userAgent)) {
    if (/Mobile/i.test(userAgent)) {
      return 'phone';
    } else {
      return 'tablet';
    }
  }
  
  // iPhone/iPod = phone
  if (/iPhone|iPod/i.test(userAgent)) {
    return 'phone';
  }
  
  // Smart TV y dispositivos especiales
  if (/Smart-?TV|WebOS|Tizen|Roku/i.test(userAgent)) {
    return 'smart_tv';
  }
  
  if (/Watch|WearOS/i.test(userAgent)) {
    return 'wearable';
  }
  
  // Otros dispositivos móviles
  if (/Mobile|BlackBerry|Windows Phone|Opera Mini|Phone/i.test(userAgent)) {
    return 'phone';
  }
  
  // Detección genérica de tablet
  if (/Tablet|Tab/i.test(userAgent)) {
    return 'tablet';
  }
  
  // Todo lo demás = desk
  return 'desk';
}

/**
 * Detecta el sistema operativo desde User Agent (sistema flexible)
 */
export function detectOperatingSystem(userAgent: string): string {
  if (!userAgent) return 'unknown';
  
  // 🔥 PRIORIDAD 1: Detectar bots específicos primero (igual que backend)
  if (/bot|crawler|spider|scraper|archiver|indexer|fetcher|checker|monitor|validator|test|headless/i.test(userAgent)) {
    if (/googlebot|google/i.test(userAgent)) return 'googlebot';
    if (/bingbot|bing/i.test(userAgent)) return 'bingbot';
    if (/facebookexternalhit|facebook/i.test(userAgent)) return 'facebook';
    if (/twitterbot|twitter/i.test(userAgent)) return 'twitter';
    if (/linkedinbot|linkedin/i.test(userAgent)) return 'linkedin';
    if (/whatsapp/i.test(userAgent)) return 'whatsapp';
    if (/telegrambot|telegram/i.test(userAgent)) return 'telegram';
    return 'generic_bot';
  }
  
  // PRIORIDAD 2: Sistemas operativos normales
  // iOS (iPhone, iPad, iPod)
  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return 'ios';
  }
  
  // Android
  if (/Android/i.test(userAgent)) {
    return 'android';
  }
  
  // Windows
  if (/Windows NT|Windows Phone|Win32|Win64|WOW64/i.test(userAgent)) {
    return 'windows';
  }
  
  // macOS
  if (/Macintosh|Mac OS X|MacIntel/i.test(userAgent)) {
    return 'macos';
  }
  
  // Chrome OS
  if (/Chrome OS/i.test(userAgent)) {
    return 'chromeos';
  }
  
  // FreeBSD
  if (/FreeBSD/i.test(userAgent)) {
    return 'freebsd';
  }
  
  // Linux
  if (/Linux|X11/i.test(userAgent)) {
    return 'linux';
  }
  
  return 'unknown';
}

/**
 * Obtiene el icono del dispositivo (sistema flexible)
 */
export function getDeviceIcon(deviceClass: string): string {
  // ✅ SISTEMA FLEXIBLE - maneja cualquier valor
  switch (deviceClass) {
    case 'phone':
      return '📱';
    case 'desk':
      return '💻'; 
    case 'tablet':
      return '📱'; 
    case 'bots':
      return '🤖';     // Nuevo: bots
    case 'smart_tv':
      return '📺';     // Nuevo: smart TV
    case 'wearable':
      return '⌚';     // Nuevo: wearables
    case 'unknown':
    default:
      return '❓';     // Fallback para cualquier valor desconocido
  }
}

/**
 * Obtiene el icono del sistema operativo (sistema flexible)
 */
export function getOSIcon(os: string): string {
  // ✅ SISTEMA FLEXIBLE - maneja cualquier valor
  switch (os) {
    case 'windows':
      return '🪟';
    case 'macos':
    case 'ios':
      return '🍎';
    case 'android':
      return '🤖';
    case 'linux':
      return '🐧';
    case 'chromeos':
      return '🌐';     // Chrome OS
    case 'freebsd':
      return '👹';     // FreeBSD
    // Bots específicos
    case 'googlebot':
      return '🔍';     // Google Bot
    case 'bingbot':
      return '🔍';     // Bing Bot
    case 'facebook':
      return '👥';     // Facebook Bot
    case 'twitter':
      return '🐦';     // Twitter Bot
    case 'linkedin':
      return '💼';     // LinkedIn Bot
    case 'whatsapp':
      return '💬';     // WhatsApp Bot
    case 'telegram':
      return '✈️';      // Telegram Bot
    case 'generic_bot':
      return '🤖';     // Bot genérico
    case 'unknown':
    default:
      return '❓';     // Fallback para cualquier valor desconocido
  }
}

/**
 * Función principal que obtiene toda la información del dispositivo
 */
export function getDeviceInfo(userAgent: string): DeviceInfo {
  const deviceClass = detectDeviceClass(userAgent);
  const deviceOs = detectOperatingSystem(userAgent);
  
  return {
    deviceClass,
    deviceOs,
    deviceIcon: getDeviceIcon(deviceClass),
    osIcon: getOSIcon(deviceOs),
  };
}

/**
 * Obtiene código de país para mostrar banderas
 */
export function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode === 'unknown') return '🌍';
  
  // Convertir código de país a emoji de bandera
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  
  return String.fromCodePoint(...codePoints);
}

/**
 * Obtiene descripción amigable del dispositivo (sistema flexible)
 */
export function getDeviceDescription(deviceInfo: DeviceInfo): string {
  // ✅ SISTEMA FLEXIBLE - usa switch para manejar cualquier valor
  
  // Mapear device_class a nombres amigables
  const getDeviceName = (deviceClass: string): string => {
    switch (deviceClass) {
      case 'phone': return 'Phone';
      case 'desk': return 'Desktop';
      case 'tablet': return 'Tablet';
      case 'bots': return 'Bot';
      case 'smart_tv': return 'Smart TV';
      case 'wearable': return 'Wearable';
      case 'unknown': return 'Unknown';
      default: return deviceClass; // Usar el valor original si no está mapeado
    }
  };
  
  // Mapear device_os a nombres amigables
  const getOsName = (deviceOs: string): string => {
    switch (deviceOs) {
      case 'windows': return 'Windows';
      case 'macos': return 'macOS';
      case 'linux': return 'Linux';
      case 'ios': return 'iOS';
      case 'android': return 'Android';
      case 'googlebot': return 'Google Bot';
      case 'bingbot': return 'Bing Bot';
      case 'facebook': return 'Facebook Bot';
      case 'twitter': return 'Twitter Bot';
      case 'linkedin': return 'LinkedIn Bot';
      case 'whatsapp': return 'WhatsApp Bot';
      case 'telegram': return 'Telegram Bot';
      case 'generic_bot': return 'Generic Bot';
      case 'chromeos': return 'Chrome OS';
      case 'freebsd': return 'FreeBSD';
      case 'unknown': return 'Unknown';
      default: return deviceOs; // Usar el valor original si no está mapeado
    }
  };
  
  const deviceName = getDeviceName(deviceInfo.deviceClass);
  const osName = getOsName(deviceInfo.deviceOs);
  
  return `${deviceName} (${osName})`;
} 