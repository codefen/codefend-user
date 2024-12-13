export type ListenerTarget =
  | Document
  | (Window & typeof globalThis)
  | FontFaceSet
  | HTMLElement
  | undefined
  | null
  | false;

export type ListerType = keyof WindowEventMap | keyof DocumentEventMap | string;
export type UnsubscribeCallback = () => void;
export type ListenerOptionsType = boolean | AddEventListenerOptions;
export type ListenerCallbackType = (ev: Event) => any;
