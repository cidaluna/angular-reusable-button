import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonConfig, ButtonSize, ButtonType, ButtonVariant } from '../../interfaces/button.interface';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input({ required: true }) label!: string;
  @Input() id?: string;
  @Input() iconName?: string;
  @Input() iconPos?: 'left' | 'right' = 'left';
  @Input() ariaLabel?: string;
  @Input() variant?: ButtonVariant;
  @Input() size?: ButtonSize;
  @Input() width?: 'auto' | 'full';
  @Input() rounded?: string;
  @Input() loading?: string;
  @Input() disabled?: string;
  @Input() type?: ButtonType;
  @Output() onClick = new EventEmitter();

  handleClickBtn() {
    console.log('::Clicou no botão: ', this.label);
    this.onClick.emit();
  }

}
