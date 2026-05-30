import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ButtonConfig, ButtonSize, ButtonType, ButtonVariant } from '../../interfaces/button.interface';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Registro global privado na memória da aplicação.
// Um 'Set' no JavaScript armazena apenas valores únicos e possui busca instantânea.
const activeButtonIds = new Set<string>();

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit, OnDestroy {
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

  // ID que será injetado no DOM
  protected generatedId: string = '';

  ngOnInit(): void {
    let uniqueId = '';

    // Loop de segurança: Gera um sufixo e verifica se ele já existe no Set global.
    // Se o ID for idêntico, o loop roda de novo e gera um novo ID.
    do {
      const randomSuffix = this.generateSuffix();
      uniqueId = `angular-reusable-button-${randomSuffix}`;
    } while (activeButtonIds.has(uniqueId));

    // Salva o ID no componente e registra no Set global para que nenhum outro botão use
    this.generatedId = uniqueId;
    activeButtonIds.add(uniqueId);
  }

  ngOnDestroy(): void {
    // Quando a tela muda ou o botão deixa de existir, liberamos o ID da memória
    activeButtonIds.delete(this.generatedId);
  }

  handleClickBtn() {
    console.log('::Clicou no botão:',this.label,'e gerado o id:', this.generatedId);
    this.onClick.emit();
  }

  private generateSuffix(): string {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';

    let randomLetters = '';
    let randomNumbers = '';

    // Cria um array de bytes aleatórios usando a API de criptografia do navegador
    const randomBytes = new Uint32Array(6);
    crypto.getRandomValues(randomBytes);

    // Seleciona 3 letras aleatórias
    for (let i = 0; i < 3; i++) {
      randomLetters += letters[randomBytes[i] % letters.length];
    }

    // Seleciona 3 números aleatórios
    for (let i = 3; i < 6; i++) {
      randomNumbers += numbers[randomBytes[i] % numbers.length];
    }

    // Junta as duas partes e embaralha o array final para misturar letras e números
    const shuffledCharacters = (randomLetters + randomNumbers).split('');

    // Embaracamento rápido usando o último byte aleatório para definir a ordem
    return shuffledCharacters
      .sort(() => (randomBytes[5] % 3) - 1)
      .join('');
  }

}
