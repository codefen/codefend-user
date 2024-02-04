// toast.d.ts
declare type ToastMessageType = 'success' | 'error' | 'info';

declare interface ToastOptions {
	autoClose?: number;
	position?: string;
	onClose?: () => void;
	canClose?: boolean;
	showProgress?: boolean;
}

declare function showToast(message: string, type: ToastMessageType, options?: ToastOptions): void;


declare class Poast {

  #toastElem: HTMLDivElement;
  #autoCloseInterval: number;
  #progressInterval: number;
  #removeBinded: () => void;
  #timeVisible: number;
  #autoClose: boolean;
  #isPaused: boolean;
  #unpause: () => void;
  #pause: () => void;
  #visibilityChange: () => void;
  #shouldUnPause: boolean;

  constructor(options: ToastOptions);

  static success(message: string, options?: ToastOptions): void;
  static error(message: string, options?: ToastOptions): void;
  static info(message: string, options?: ToastOptions): void;


  set autoClose(value: boolean);

  set position(value: string);

  set text(value: string);

  set canClose(value: boolean);

  set showProgress(value: boolean);

  set pauseOnHover(value: boolean);

  set pauseOnFocusLoss(value: boolean);

  update(options: ToastOptions): void;

  remove(): void;
}

declare function createContainer(position: string): HTMLDivElement;

export { Poast, createContainer };
