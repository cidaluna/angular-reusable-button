import { Injectable } from '@angular/core';

/**
 * ButtonIdRegistry
 *
 * Serviço singleton responsável por garantir unicidade de IDs entre todas
 * as instâncias de ButtonComponent na aplicação.
 *
 * Por que um serviço e não um const no módulo?
 * - Testável: cada spec pode injetar uma instância limpa via TestBed.
 * - Substituível: pode ser sobrescrito em testes ou ambientes específicos.
 * - Explícito: a dependência aparece no construtor — sem acoplamento oculto.
 *
 */

@Injectable({
  providedIn: 'root'
})
export class ButtonIdRegistryService {

  private readonly ids = new Set<string>();

  /** Registra um ID como em uso. Chamado pelo ButtonComponent no construtor. */
  register(id: string): void {
    this.ids.add(id);
  }

  /** Libera um ID ao destruir o componente. Evita memory leak em listas dinâmicas. */
  release(id: string): void {
    this.ids.delete(id);
  }

  /** Verifica se um ID já está em uso. Usado no loop de geração de ID único. */
  has(id: string): boolean {
    return this.ids.has(id);
  }
}
