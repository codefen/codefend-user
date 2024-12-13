/// <reference types="vite/client" />

//Añadir variables del .env
interface ImportMetaEnv {
  readonly INTEL_HOST: string;
  readonly VITE_API_URI: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
