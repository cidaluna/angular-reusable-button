import { Component } from '@angular/core';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { CommonModule } from '@angular/common';
import { ButtonClickEvent } from '../../shared/interfaces/button.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  btnClickedHome(event: ButtonClickEvent): void {
    console.log(`:: Clicou no botão: "${event.label}" | ID no DOM: "${event.id}" | Acionado por: [${event.triggeredBy}]`);

    // Exemplo de tomada de decisão baseada no botão clicado
    if (event.label === 'Salvar') {
      this.executeData();
    }
  }

  private executeData() {
    console.log('Executando dados...');
  }
}
