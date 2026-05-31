export type ButtonType = 'button' | 'submit' | 'reset';
export type ButtonVariant = 'primary' | 'secondary' | 'outlined';

export interface ButtonConfig {
  id?: string;
  label: string;
  icon?: string;
  iconPos?: 'left' | 'right';
  ariaLabel?: string;
  variant?: ButtonVariant;
  width?: 'auto' | 'full';
  rounded?: boolean;
  loading?: boolean;
  disabled?:boolean;
  type?: ButtonType;
}

// Interface que define todas as informações de clique via mouse ou teclado que o pai (home) vai receber
export interface ButtonClickEvent {
  id: string;
  label: string;
  triggeredBy: 'mouse' | 'keyboard';
}
