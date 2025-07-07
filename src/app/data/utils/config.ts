export const baseUrl = import.meta.env['VITE_API_URI'];
export const stripeKey = import.meta.env['VITE_STRIPE_KEY_LIVE'];
export const stripeKeyTest = import.meta.env['VITE_STRIPE_KEY_TEST'];
export const nodeEnv = import.meta.env['VITE_NODE_ENV'];

// Google OAuth Configuration
export const googleClientId = import.meta.env['VITE_GOOGLE_CLIENT_ID'];

// App Environment
export const appEnv = import.meta.env['VITE_APP_ENV'] || 'development';

// Feature Flags
export const enableGoogleAuth = import.meta.env['VITE_ENABLE_GOOGLE_AUTH'] !== 'false';

// Debug Mode
export const debugMode = import.meta.env['VITE_DEBUG'] === 'true';
