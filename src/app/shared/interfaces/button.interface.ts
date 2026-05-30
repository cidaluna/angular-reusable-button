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
