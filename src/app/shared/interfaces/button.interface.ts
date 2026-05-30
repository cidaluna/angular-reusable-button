export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface ButtonConfig {
  id?: string;
  label: string;
  icon?: string;
  iconPos?: 'left' | 'right';
  ariaLabel?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  width?: 'auto' | 'full';
  rounded?: boolean;
  loading?: boolean;
  disabled?:boolean;
  type?: ButtonType;
}
