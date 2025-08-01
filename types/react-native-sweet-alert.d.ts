declare module 'react-native-sweet-alert' {
  interface SweetAlertOptions {
    title: string;
    subTitle?: string;
    confirmButtonTitle?: string;
    otherButtonTitle?: string;
    style?: 'default' | 'success' | 'error' | 'warning' | 'info';
    cancellable?: boolean;
  }

  export default class SweetAlert {
    static showAlertWithOptions(options: SweetAlertOptions, callback?: () => void): void;
  }
}
