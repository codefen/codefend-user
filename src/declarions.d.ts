declare module '/editor-lib' {
  const tinyMCE: any;
  export default tinyMCE;
}

declare global {
  interface Window {
    tinyMCE: any;
    __TAURI__: any;
    dataLayer: any;
  }
}

export {};

// Add fallback declaration for React automatic JSX runtime resolution
declare module 'react/jsx-runtime' {
  const jsxRuntime: any;
  export default jsxRuntime;
}
