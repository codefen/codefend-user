export enum ButtonStyles {
  RED = 'red',
  BLACK = 'black',
  DARK_RED = 'dark-red',
  GRAY = 'gray',
  SEND = 'send',
  DEFAULT = 'default',
}

export class AppConstants {
  public static readonly BUTTON_STYLES: Record<ButtonStyles, string> = {
    [ButtonStyles.RED]: 'btn-red',
    [ButtonStyles.BLACK]: 'btn-black',
    [ButtonStyles.GRAY]: 'btn-gray',
    [ButtonStyles.SEND]: 'btn-red send-btn',
    [ButtonStyles.DARK_RED]: 'btn-dark-red',
    [ButtonStyles.DEFAULT]: '',
  };
}
