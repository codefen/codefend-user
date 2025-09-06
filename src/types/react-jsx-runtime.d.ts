// Fallback types for the automatic React JSX runtime resolution
// Ensures the TypeScript program can resolve 'react/jsx-runtime'
declare module 'react/jsx-runtime' {
  const jsxRuntime: any;
  export default jsxRuntime;
}

// Ensure JSX namespace is available to avoid IntrinsicElements errors as a last resort
// If React types load correctly, this augmentation is ignored
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};
