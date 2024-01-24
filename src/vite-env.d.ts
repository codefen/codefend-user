/// <reference types="vite/client" />

//Añadir variables del .env
interface ImportMetaEnv {
  readonly VITE_INTEL_HOST: string;
  readonly VITE_PHP_SERVER_HOST: string;
  readonly VITE_SERVER_HOST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
