export const baseUrl = import.meta.env['VITE_API_URI'] || 'https://api.codefend.app/index.php';
/** Publishable keys; si solo tenés `VITE_STRIPE_KEY` (legacy), se usa como respaldo en ambos modos. */
export const stripeKey =
  import.meta.env['VITE_STRIPE_KEY_LIVE'] ?? import.meta.env['VITE_STRIPE_KEY'] ?? '';
export const stripeKeyTest =
  import.meta.env['VITE_STRIPE_KEY_TEST'] ?? import.meta.env['VITE_STRIPE_KEY'] ?? '';
export const nodeEnv = import.meta.env['VITE_NODE_ENV'] || 'development';

/**
 * Claves publishable alineadas con `reservado/llaves.php` (endpoint `config/stripe_public`).
 * Si la API responde, usa esas cadenas; si no, cae a las variables Vite.
 */
export async function fetchStripePublishableKeysFromApi(): Promise<{ test: string; live: string }> {
  const base = baseUrl.replace(/\/index\.php$/, '');
  const url = `${base}/config/stripe_public`;
  try {
    const res = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(String(res.status));
    const j = (await res.json()) as {
      error?: string;
      stripe_pk_test?: string;
      stripe_pk_live?: string;
    };
    if (j.error === '1') throw new Error('stripe_public');
    const apiTest = j.stripe_pk_test?.trim() ?? '';
    const apiLive = j.stripe_pk_live?.trim() ?? '';
    return {
      test: apiTest || stripeKeyTest,
      live: apiLive || stripeKey,
    };
  } catch {
    return { test: stripeKeyTest, live: stripeKey };
  }
}

// Google OAuth Configuration
export const googleClientId = import.meta.env['VITE_GOOGLE_CLIENT_ID'] || '';

// App Environment
export const appEnv = import.meta.env['VITE_APP_ENV'] || 'development';

// Feature Flags
export const enableGoogleAuth = import.meta.env['VITE_ENABLE_GOOGLE_AUTH'] !== 'false';

// Debug Mode
export const debugMode = import.meta.env['VITE_DEBUG'] === 'true';
