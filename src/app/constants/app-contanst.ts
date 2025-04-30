import { ResourcesTypes } from '@interfaces/order';

export enum ButtonStyles {
  RED = 'red',
  BLACK = 'black',
  DARK_RED = 'dark-red',
  GRAY = 'gray',
  SEND = 'send',
  DEFAULT = 'default',
  DARK_BLACK = 'dark-black',
}

const PLAN_IMAGE = {
  small: '/codefend/small-plan.png',
  medium: '/codefend/medium-plan.png',
  advanced: '/codefend/advanced-plan.png',
};

export class AppConstants {
  public static readonly BUTTON_STYLES: Record<ButtonStyles, string> = {
    [ButtonStyles.RED]: 'btn-red',
    [ButtonStyles.BLACK]: 'btn-black',
    [ButtonStyles.GRAY]: 'btn-gray',
    [ButtonStyles.SEND]: 'btn-red send-btn',
    [ButtonStyles.DARK_RED]: 'btn-dark-red',
    [ButtonStyles.DEFAULT]: '',
    [ButtonStyles.DARK_BLACK]: 'btn-dark-black',
  };
  public static readonly PLAN_PREFERENCE_MAP = {
    [ResourcesTypes.WEB]: {
      planTitle:
        'Planes pequeños exclusivos para aplicaciones web ofrecen una combinacion unica de <b>scanners automaticos, asistencia tecnica</b> especializada y <b>busqueda de dataleaks.</b> Todos brindan acceso limitado a la plataforma con creacion de informes y visualizacion de issues.',
      small: {
        type: 'small',
        price: '$1,500',
        promise: 'analisis unico pequeño',
        list: [
          'Maximo recomendado de <b>2 dominios.</b>',
          'Maximo recomendado de <b>6 subdominios.</b>',
          'Valor de los dominios: <b>normal.</b>',
          'Neuroscan: <b>5 scaneos automatizados.</b>',
          'Dataleaks search: <b>10 búsquedas.</b>',
          '<b>40 horas</b> de pentest manual.',
        ],
        title: 'Basic pentest on demand',
        description:
          'Recommended for small sized businesses. Máximo recomendado de 2 dominios. Máximo recomendado de 6 subdominios. Valor de los dominios: normal. Neuroscan: 5 scaneos automatizados. Dataleaks search: 10 búsquedas. 40 horas de pentest manual.',
      },
      medium: {
        type: 'medium',
        price: '$4,500',
        promise: 'analisis unico intermedio',
        list: [
          'Maximo recomendado de <b>5 dominios.</b>',
          'Maximo recomendado de <b>15 subdominios.</b>',
          'Valor de los dominios: <b>normal.</b>',
          'Neuroscan: <b>10 escaneos automatizados.</b>',
          'Dataleaks search: <b>20 busquedas.</b>',
          '<b>120 horas</b> de pentest manual.',
        ],
        title: 'Medium pentest on demand',
        description:
          'Medium pentest on demand Recommended for mid sized businesses. Máximo recomendado de 5 dominios. Máximo recomendado de 15 subdominios. Valor de los dominios: normal.Neuroscan: 15 scaneos automatizados. Dataleaks search: 30 búsquedas. 120 horas de pentest manual.',
      },
      advanced: {
        type: 'advanced',
        price: '$13,500',
        promise: 'analisis unico avanzado',
        list: [
          'Maximo recomendado de <b>10 a 15 dominios.</b>',
          'Maximo recomendado de <b>30 subdominios.</b>',
          'Valor de los dominios: <b>elevado.</b>',
          'Neuroscan: <b>60 escaneos automatizados.</b>',
          'Dataleaks search: <b>60 busquedas.</b>',
          '<b>360 horas</b> de pentest manual.',
        ],
        title: 'Advanced pentest on demand',
        description:
          'Recommended for stablished businesses. Máximo recomendado de 10 a 15 dominios. Máximo recomendado de 30 subdominios. Valor de los dominios: elevado. Neuroscan: 60 scaneos automatizados. Dataleaks search: 60 búsquedas. 360 horas de pentest manual.',
      },
    },
    [ResourcesTypes.MOBILE]: {
      planTitle:
        'Planes XXXXXXXX ofrecen una combinacion unica de <b>scanners automaticos, asistencia tecnica</b> especializada y <b>busqueda de dataleaks.</b> Todos brindan acceso limitado a la plataforma con creacion de informes y visualizacion de issues.',
      small: {
        type: 'small',
        price: '$1,500',
        promise: 'analisis unico pequeño',
        list: [
          'Valor de los XXXX: <b>normal.</b>',
          'Neuroscan: <b>5 scaneos automatizados.</b>',
          'Dataleaks search: <b>10 búsquedas.</b>',
          '<b>40 horas</b> de pentest manual.',
        ],
        title: 'Basic pentest on demand',
        description:
          'Recommended for small sized businesses. XXXXXXX. Neuroscan: 5 scaneos automatizados. Dataleaks search: 10 búsquedas. 40 horas de pentest manual.',
      },
      medium: {
        type: 'medium',
        price: '$4,500',
        promise: 'analisis unico intermedio',
        list: [
          'Valor de los XXXX: <b>normal.</b>',
          'Neuroscan: <b>10 escaneos automatizados.</b>',
          'Dataleaks search: <b>20 busquedas.</b>',
          '<b>120 horas</b> de pentest manual.',
        ],
        title: 'Advanced pentest on demand',
        description:
          'Medium pentest on demand Recommended for mid sized businesses. XXXXXXX. Neuroscan: 15 scaneos automatizados. Dataleaks search: 30 búsquedas. 120 horas de pentest manual.',
      },
      advanced: {
        type: 'advanced',
        price: '$13,500',
        promise: 'analisis unico avanzado',
        list: [
          'Valor de los XXXX: <b>elevado.</b>',
          'Neuroscan: <b>60 escaneos automatizados.</b>',
          'Dataleaks search: <b>60 busquedas.</b>',
          '<b>360 horas</b> de pentest manual.',
        ],
        title: 'Advanced pentest on demand',
        description:
          'Recommended for stablished businesses. XXXXXXX. Neuroscan: 60 scaneos automatizados. Dataleaks search: 60 búsquedas. 360 horas de pentest manual.',
      },
    },
    [ResourcesTypes.NETWORK]: {
      planTitle:
        'Planes XXXXXXXX ofrecen una combinacion unica de <b>scanners automaticos, asistencia tecnica</b> especializada y <b>busqueda de dataleaks.</b> Todos brindan acceso limitado a la plataforma con creacion de informes y visualizacion de issues.',
      small: {
        type: 'small',
        price: '$1,500',
        promise: 'analisis unico pequeño',
        list: [
          'Valor de los XXXX: <b>normal.</b>',
          'Neuroscan: <b>5 scaneos automatizados.</b>',
          'Dataleaks search: <b>10 búsquedas.</b>',
          '<b>40 horas</b> de pentest manual.',
        ],
        title: 'Basic pentest on demand',
        description:
          'Recommended for small sized businesses. XXXXXXX. Neuroscan: 5 scaneos automatizados. Dataleaks search: 10 búsquedas. 40 horas de pentest manual.',
      },
      medium: {
        type: 'medium',
        price: '$4,500',
        promise: 'analisis unico intermedio',
        list: [
          'Valor de los XXXX: <b>normal.</b>',
          'Neuroscan: <b>10 escaneos automatizados.</b>',
          'Dataleaks search: <b>20 busquedas.</b>',
          '<b>120 horas</b> de pentest manual.',
        ],
        title: 'Advanced pentest on demand',
        description:
          'Medium pentest on demand Recommended for mid sized businesses. XXXXXXX. Neuroscan: 15 scaneos automatizados. Dataleaks search: 30 búsquedas. 120 horas de pentest manual.',
      },
      advanced: {
        type: 'advanced',
        price: '$13,500',
        promise: 'analisis unico avanzado',
        list: [
          'Valor de los XXXX: <b>elevado.</b>',
          'Neuroscan: <b>60 escaneos automatizados.</b>',
          'Dataleaks search: <b>60 busquedas.</b>',
          '<b>360 horas</b> de pentest manual.',
        ],
        title: 'Advanced pentest on demand',
        description:
          'Recommended for stablished businesses. XXXXXXX. Neuroscan: 60 scaneos automatizados. Dataleaks search: 60 búsquedas. 360 horas de pentest manual.',
      },
    },
    [ResourcesTypes.SOCIAL]: {
      planTitle:
        'Planes XXXXXXXX ofrecen una combinacion unica de <b>scanners automaticos, asistencia tecnica</b> especializada y <b>busqueda de dataleaks.</b> Todos brindan acceso limitado a la plataforma con creacion de informes y visualizacion de issues.',
      small: {
        type: 'small',
        price: '$1,500',
        promise: 'analisis unico pequeño',
        list: [
          'Valor de los XXXX: <b>normal.</b>',
          'Neuroscan: <b>5 scaneos automatizados.</b>',
          'Dataleaks search: <b>10 búsquedas.</b>',
          '<b>40 horas</b> de pentest manual.',
        ],
        title: 'Basic pentest on demand',
        description:
          'Recommended for small sized businesses. XXXXXXX. Neuroscan: 5 scaneos automatizados. Dataleaks search: 10 búsquedas. 40 horas de pentest manual.',
      },
      medium: {
        type: 'medium',
        price: '$4,500',
        promise: 'analisis unico intermedio',
        list: [
          'Valor de los XXXX: <b>normal.</b>',
          'Neuroscan: <b>10 escaneos automatizados.</b>',
          'Dataleaks search: <b>20 busquedas.</b>',
          '<b>120 horas</b> de pentest manual.',
        ],
        title: 'Advanced pentest on demand',
        description:
          'Medium pentest on demand Recommended for mid sized businesses. XXXXXXX. Neuroscan: 15 scaneos automatizados. Dataleaks search: 30 búsquedas. 120 horas de pentest manual.',
      },
      advanced: {
        type: 'advanced',
        price: '$13,500',
        promise: 'analisis unico avanzado',
        list: [
          'Valor de los XXXX: <b>elevado.</b>',
          'Neuroscan: <b>60 escaneos automatizados.</b>',
          'Dataleaks search: <b>60 busquedas.</b>',
          '<b>360 horas</b> de pentest manual.',
        ],
        title: 'Advanced pentest on demand',
        description:
          'Recommended for stablished businesses. XXXXXXX. Neuroscan: 60 scaneos automatizados. Dataleaks search: 60 búsquedas. 360 horas de pentest manual.',
      },
    },
    [ResourcesTypes.CLOUD]: {
      planTitle:
        'Planes XXXXXXXX ofrecen una combinacion unica de <b>scanners automaticos, asistencia tecnica</b> especializada y <b>busqueda de dataleaks.</b> Todos brindan acceso limitado a la plataforma con creacion de informes y visualizacion de issues.',
      small: {
        type: 'small',
        price: '$1,500',
        promise: 'analisis unico pequeño',
        list: [
          'Valor de los XXXX: <b>normal.</b>',
          'Neuroscan: <b>5 scaneos automatizados.</b>',
          'Dataleaks search: <b>10 búsquedas.</b>',
          '<b>40 horas</b> de pentest manual.',
        ],
        title: 'Basic pentest on demand',
        description:
          'Recommended for small sized businesses. XXXXXXX. Neuroscan: 5 scaneos automatizados. Dataleaks search: 10 búsquedas. 40 horas de pentest manual.',
      },
      medium: {
        type: 'medium',
        price: '$4,500',
        promise: 'analisis unico intermedio',
        list: [
          'Valor de los XXXX: <b>normal.</b>',
          'Neuroscan: <b>10 escaneos automatizados.</b>',
          'Dataleaks search: <b>20 busquedas.</b>',
          '<b>120 horas</b> de pentest manual.',
        ],
        title: 'Advanced pentest on demand',
        description:
          'Medium pentest on demand Recommended for mid sized businesses. XXXXXXX. Neuroscan: 15 scaneos automatizados. Dataleaks search: 30 búsquedas. 120 horas de pentest manual.',
      },
      advanced: {
        type: 'advanced',
        price: '$13,500',
        promise: 'analisis unico avanzado',
        list: [
          'Valor de los XXXX: <b>elevado.</b>',
          'Neuroscan: <b>60 escaneos automatizados.</b>',
          'Dataleaks search: <b>60 busquedas.</b>',
          '<b>360 horas</b> de pentest manual.',
        ],
        title: 'Advanced pentest on demand',
        description:
          'Recommended for stablished businesses. XXXXXXX. Neuroscan: 60 scaneos automatizados. Dataleaks search: 60 búsquedas. 360 horas de pentest manual.',
      },
    },
    [ResourcesTypes.CODE]: {
      planTitle:
        'Planes XXXXXXXX ofrecen una combinacion unica de <b>scanners automaticos, asistencia tecnica</b> especializada y <b>busqueda de dataleaks.</b> Todos brindan acceso limitado a la plataforma con creacion de informes y visualizacion de issues.',
      small: {
        type: 'small',
        price: '$1,500',
        promise: 'analisis unico pequeño',
        list: [
          'Valor de los XXXX: <b>normal.</b>',
          'Neuroscan: <b>5 scaneos automatizados.</b>',
          'Dataleaks search: <b>10 búsquedas.</b>',
          '<b>40 horas</b> de pentest manual.',
        ],
        title: 'Basic pentest on demand',
        description:
          'Recommended for small sized businesses. XXXXXXX. Neuroscan: 5 scaneos automatizados. Dataleaks search: 10 búsquedas. 40 horas de pentest manual.',
      },
      medium: {
        type: 'medium',
        price: '$4,500',
        promise: 'analisis unico intermedio',
        list: [
          'Valor de los XXXX: <b>normal.</b>',
          'Neuroscan: <b>10 escaneos automatizados.</b>',
          'Dataleaks search: <b>20 busquedas.</b>',
          '<b>120 horas</b> de pentest manual.',
        ],
        title: 'Advanced pentest on demand',
        description:
          'Medium pentest on demand Recommended for mid sized businesses. XXXXXXX. Neuroscan: 15 scaneos automatizados. Dataleaks search: 30 búsquedas. 120 horas de pentest manual.',
      },
      advanced: {
        type: 'advanced',
        price: '$13,500',
        promise: 'analisis unico avanzado',
        list: [
          'Valor de los XXXX: <b>elevado.</b>',
          'Neuroscan: <b>60 escaneos automatizados.</b>',
          'Dataleaks search: <b>60 busquedas.</b>',
          '<b>360 horas</b> de pentest manual.',
        ],
        title: 'Advanced pentest on demand',
        description:
          'Recommended for stablished businesses. XXXXXXX. Neuroscan: 60 scaneos automatizados. Dataleaks search: 60 búsquedas. 360 horas de pentest manual.',
      },
    },
  };
}
