declare module '/editor-lib' {
  const tinyMCE: any;
  export default tinyMCE;
}

declare global {
  interface Window {
    tinyMCE: any;
    __TAURI__: any;
  }
}

export {};
