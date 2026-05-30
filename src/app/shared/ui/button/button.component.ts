import { Component, Input } from '@angular/core';
import { ButtonConfig, ButtonSize, ButtonType, ButtonVariant } from '../../interfaces/button.interface';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input({ required: true }) label!: string;
  @Input() id?: string;
  @Input() icon?: string;
  @Input() iconPos?: 'left' | 'right';;
  @Input() variant?: ButtonVariant;
  @Input() size?: ButtonSize;
  @Input() width?: 'auto' | 'full';
  @Input() rounded?: string;
  @Input() loading?: string;
  @Input() disabled?: string;
  @Input() type?: ButtonType;
}
