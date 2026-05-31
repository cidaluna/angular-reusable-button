import { Component, EventEmitter, HostBinding, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ButtonClickEvent, ButtonType, ButtonVariant } from '../../interfaces/button.interface';
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
  @Input() variant?: ButtonVariant; // Padrão primary azul
  @Input() rounded?: string;
  @Input() loading?: string;
  @Input() disabled?: boolean = false;
  @Input() type?: ButtonType;

  // Toda vez que receber o input width, pegue esse valor recebido e injete na casca externa <app-button> automaticamente
  @Input() @HostBinding('attr.data-width') width: 'auto' | 'full' = 'auto';

  // Gerenciador Nativo de Foco de Teclado (Tabindex)
  @HostBinding('attr.tabindex')
  get tabIndex(): number {
    // Se o botão estiver desabilitado, ele sai da fila do teclado (-1)
    // Se estiver ativo, ele entra na ordem natural de foco da página (0)
    const isDisabled = this.disabled || false;
    return isDisabled ? -1 : 0;
  }

  // Garante que o navegador e os leitores de tela identifiquem <app-button> como um botão real
  @HostBinding('attr.role') protected readonly role = 'button';

  // Informa aos leitores de tela se o botão está desabilitado na casca
  @HostBinding('attr.aria-disabled')
  get ariaDisabled(): boolean {
    // No JavaScript/TypeScript, a dupla exclamação converte qualquer valor (inclusive undefined) para um booleano real (true ou false)
    return !!this.disabled; // undefined vira false
  }

  @Output() btnClick = new EventEmitter<ButtonClickEvent>();

  // ID que será injetado no DOM
  protected generatedId: string = '';

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    // Quando a tela muda ou o botão deixa de existir, liberamos o ID da memória
    activeButtonIds.delete(this.generatedId);
  }

  // Escuta o clique físico do mouse na casca do componente
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.emitEvent('mouse'); // Dispara o evento avisando que foi pelo mouse
  }

  // Escuta as teclas Enter e Espaço quando o botão estiver focado pelo teclado
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.disabled) return;

    // Se pressionar Enter (Key: Enter) ou Barra de Espaço (Key: ' ')
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // Evita que a página role para baixo ao apertar Espaço
      this.emitEvent('keyboard'); // Dispara o evento avisando que foi pelo teclado
    }
  }

   // Função auxiliar que monta o objeto e envia de fato para o pai
  private emitEvent(origin: 'mouse' | 'keyboard'): void {
    this.btnClick.emit({
      id: this.generatedId,
      label: this.label,
      triggeredBy: origin
    });
  }

  protected initializeComponent() {
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
