import { Component, computed, DestroyRef, HostBinding, HostListener, inject, input, output, signal } from '@angular/core';
import { ButtonClickEvent, ButtonType, ButtonVariant } from '../../interfaces/button.interface';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonIdRegistryService } from '../../services/button-id-registry.service';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  // ───────────  Injetando o service que controla o id em uso ──────────────
  private readonly idRegistry  = inject(ButtonIdRegistryService);
  private readonly destroyRef  = inject(DestroyRef);

  // ── Inputs (signal API) ───── [migrado de @Input() para input()] ─────────
  /** Texto exibido no botão. Obrigatório — erro de compilação se omitido. */
  readonly label    = input.required<string>();

  /** Nome do ícone FontAwesome (ex: faTrash). Opcional. */
  readonly iconName = input<string | undefined>(undefined);

  /** Posição do ícone em relação ao label. */
  readonly iconPos  = input<'left' | 'right'>('left');

  /** Label alternativo para leitores de tela quando o texto visível não for suficiente. */
  readonly ariaLabel = input<string | undefined>(undefined);

  /** Variante visual do botão (primary, secondary, ghost, danger…). */
  readonly variant  = input<ButtonVariant | undefined>(undefined);

  /** Borda arredondada estilo pill. */
  readonly rounded  = input<boolean>(false);

  /** Exibe spinner e bloqueia interações enquanto uma ação estiver em andamento. */
  readonly loading  = input<boolean>(false);

  /** Desabilita o botão explicitamente. */
  readonly disabled = input<boolean>(false);

  /** Tipo HTML nativo do botão: button | submit | reset. */
  readonly type     = input<ButtonType>('button');

  /** Largura do componente host. Injetada como atributo data-width no elemento <app-button>. */
  // Toda vez que receber o input width, pegue esse valor recebido e injete na casca externa <app-button> automaticamente
  readonly width    = input<'auto' | 'full'>('auto');
  //@Input() @HostBinding('attr.data-width') width: 'auto' | 'full' = 'auto';


  // ── Output ────────────────────────────────────────────────────────────────
  /** Emitido ao clicar (mouse ou teclado). Carrega id, label e origem da interação. */
  readonly buttonClick = output<ButtonClickEvent>();

  // ── Estado interno ─────────────────────────────────────────────────────────

  /**
   * ID único gerado por criptografia e registrado no ButtonIdRegistry.
   * Calculado uma única vez na construção — sem janela de valor vazio.
   */
  protected readonly generatedId = signal(this.buildUniqueId());

  // ── Computed: estado inativo ───────────────────────────────────────────────

  /** Verdadeiro se o botão estiver desabilitado OU em loading. */
  protected readonly isInactive = computed(
    () => this.disabled() || this.loading()
  );

  /**
   * Classes CSS do <button> interno.
   *
   * DECISÃO DE DESIGN — por que não há classes de variante ou width aqui:
   * Seu SCSS estiliza via atributos data-* ([data-variant], [data-width], [data-icon-pos])
   * e via :disabled nativo. Essas propriedades já são aplicadas como [attr.*] no template,
   * então o computed só precisa gerenciar o que o SCSS não resolve por atributo:
   *
   * ✔ custom-button        — classe base, sempre presente
   * ✔ custom-button--loading  — controla visibilidade do spinner no SCSS
   * ✔ custom-button--rounded  — borda pill, se não estiver no seu SCSS adicione a regra
   * ✔ custom-button--icon-only — padding simétrico quando não há label, só ícone
   *
   * ✘ custom-button--primary/secondary/outlined — desnecessário, SCSS usa [data-variant]
   * ✘ custom-button--disabled                  — desnecessário, SCSS usa :disabled nativo
   * ✘ custom-button--full                      — desnecessário, SCSS usa [data-width]
   */
  protected readonly buttonClasses = computed(() => ({
    'custom-button':             true,
    'custom-button--loading':    this.loading(),
    'custom-button--rounded':    this.rounded(),
    'custom-button--icon-only':  !!this.iconName() && !this.label(),
  }));

  // ── HostBindings ──────────────────────────────────────────────────────────

  /** Injeta data-width na casca <app-button> para controle de largura via CSS. */
  @HostBinding('attr.data-width')
  get hostWidth(): string {
    return this.width();
  }

  /**
   * Gerencia o tabindex diretamente no host.
   * -1 → botão fora da fila de teclado (inativo).
   *  0 → botão na ordem natural de foco da página.
   */
  @HostBinding('attr.tabindex')
  get hostTabIndex(): number {
    return this.isInactive() ? -1 : 0;
  }

  /** Identifica <app-button> como botão real para navegadores e leitores de tela. */
  @HostBinding('attr.role')
  protected readonly role = 'button';

  /** Comunica o estado desabilitado para leitores de tela via aria-disabled. */
  @HostBinding('attr.aria-disabled')
  get hostAriaDisabled(): boolean {
    return this.isInactive();
  }

  // ── Construtor ────────────────────────────────────────────────────────────

  constructor() {
    // Registra o ID gerado no serviço global de controle de unicidade
    this.idRegistry.register(this.generatedId());

    // Libera o ID ao destruir o componente — evita memory leak em listas dinâmicas
    this.destroyRef.onDestroy(() =>
      this.idRegistry.release(this.generatedId())
    );
  }


  // ── HostListeners ─────────────────────────────────────────────────────────

  /** Escuta cliques físicos do mouse na casca do componente. */
  @HostListener('click', ['$event'])
  protected onMouseClick(event: MouseEvent): void {
    if (this.isInactive()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.emitButtonClick('mouse'); // Dispara o evento avisando que foi pelo mouse
  }

  /**
   * Escuta Enter e Espaço para suporte a teclado.
   * Necessário porque <app-button> é um custom element, não um <button> nativo.
   * preventDefault() evita que Espaço role a página.
   */
  @HostListener('keydown', ['$event'])
  protected onKeyDown(event: KeyboardEvent): void {
    if (this.isInactive()) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // Evita que a página role para baixo ao apertar Espaço
      this.emitButtonClick('keyboard'); // Dispara o evento avisando que foi pelo teclado
    }
  }

 // ── Métodos privados ──────────────────────────────────────────────────────

  /**
   * Monta o payload e emite o output buttonClick.
   * Separado dos listeners para respeitar o SRP — cada método faz uma coisa.
   */
  private emitButtonClick(origin: 'mouse' | 'keyboard'): void {
    this.buttonClick.emit({
      id:          this.generatedId(),
      label:       this.label(),
      triggeredBy: origin,
    });
  }

  /**
   * Gera um ID único verificando colisões no registry antes de retornar.
   * Loop de segurança: na prática nunca passa da primeira iteração.
   */
  private buildUniqueId(): string {
    let id: string;
    do {
      id = `angular-reusable-button-${this.generateSuffix()}`;
    } while (this.idRegistry?.has(id)); // ?. seguro durante a construção inicial
    return id;
  }

   /**
   * Gera um sufixo aleatório de 6 caracteres (3 letras + 3 números) via Web Crypto API.
   * Usa Fisher-Yates para embaralhar — distribuição uniforme, sem bias do .sort().
   */
  private generateSuffix(): string {
    const LETTERS = 'abcdefghijklmnopqrstuvwxyz';
    const DIGITS  = '0123456789';

    const randomBytes = new Uint32Array(6);
    crypto.getRandomValues(randomBytes);

    const chars = [
      ...Array.from({ length: 3 }, (_, i) => LETTERS[randomBytes[i]     % LETTERS.length]),
      ...Array.from({ length: 3 }, (_, i) => DIGITS [randomBytes[i + 3] % DIGITS.length]),
    ];

    return this.fisherYatesShuffle(chars, randomBytes).join('');
  }

  /**
   * Embaralhamento Fisher-Yates — O(n), distribuição uniforme.
   * Substitui o .sort(() => random) que introduzia bias de ordenação.
   */
  private fisherYatesShuffle(arr: string[], randomBytes: Uint32Array): string[] {
    const result = [...arr];
    const extraBytes = new Uint32Array(result.length);
    crypto.getRandomValues(extraBytes);

    for (let i = result.length - 1; i > 0; i--) {
      const j = extraBytes[i] % (i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}
