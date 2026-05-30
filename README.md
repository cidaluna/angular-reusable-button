# Angular Reusable Button

Esse projeto foi desenvolvido utilizando a versão moderna do **Angular 18+ (Componentes Standalone)** e **SCSS**.
O objetivo central desta aplicação não é apenas exibir um botão na tela, mas sim demonstrar na prática os benefícios arquiteturais que a criação de **Componentes Reutilizáveis** traz para a escalabilidade do desenvolvimento frontend, seguindo padrões de **Clean Code**, **SOLID** e **Design System**.

### 📋 Pré-Requisitos
- Node.js 18
- Angular CLI 18.2.19

## 🚀 Como rodar a aplicação

1. **Clone o repositório:**
  ```bash
    git clone https://github.com/cidaluna/angular-reusable-button.git
  ```

2. **Navegue até o diretório do projeto**
```bash
  cd angular-reusable-button
```

3. **Instale as dependências do projeto**
  ```bash 
    npm install
  ```

4. **Inicie a aplicação Angular**
  ```bash 
    ng serve
  ```

5. **Abra o seu navegador e acesse a aplicação em:**
  ```text
   http://localhost:4200/
   ```

### Geração Dinâmica de IDs Criptográficos (Client-Side)
Em aplicações corporativas de grande porte, atribuir IDs sequenciais estáticos (`1`, `2`, `3`) em componentes compartilhados gera colisões graves no DOM, quebrando ferramentas de leitores de tela (**WCAG**) e invalidando testes automatizados (**Cypress / Playwright**).

Para solucionar este problema de forma 100% isolada e sem dependência de banco de dados, implementamos um gerador de sufixos alfanuméricos na inicialização do componente (`ngOnInit`) integrado a um validador de memória (`Set`).

* **Web Crypto API:** Utilizamos o método `crypto.getRandomValues()` para garantir aleatoriedade real de 3 letras e 3 números misturados.
* **Memory Leak Prevention:** Através do gancho de ciclo de vida `ngOnDestroy`, os IDs são destruídos da memória assim que o componente deixa a tela.

```html
<!-- Exemplo real de IDs únicos, imprevisíveis e imunes à colisão gerados no DOM: -->
<button class="custom-button" id="ng-reusable-btn-vry833">...</button>
<button class="custom-button" id="ng-reusable-btn-694kac">...</button>
```
---

### 💡 O Mistério do Componente "Casca" e o Poder do `@HostBinding`

Se você já tentou criar um componente reutilizável em Angular e usou Flexbox no componente pai, provavelmente se deparou com um bug invisível: **o botão com largura `width="full"` simplesmente recusa-se a esticar ou quebrar a linha**, mesmo com o CSS interno configurado perfeitamente.

Por que isso acontece? Vamos entender a anatomia oculta do Angular no navegador:

#### 🕵️‍♂️ O Problema Oculto: A Tag `<app-button>`

Quando consumimos nosso componente em uma página pai, escrevemos assim:
```html
<div class="home__buttons">
  <app-button width="full">Exportar</app-button>
</div>
```

Para o navegador, a tag `<app-button>` funciona como uma **caixa externa invisível (uma "casca")**, e o botão real (`<button class="custom-button">`) fica escondido lá dentro. 

O Flexbox do pai (`.home__buttons`) só consegue enxergar e aplicar regras de layout na **casca**. Como a casca não tem propriedades flexíveis nativas, o botão interno tenta esticar para `100%`, mas fica preso em uma caixa sem largura definida.


#### ⚡ A Solução Arquitetural: Engenharia de Alto Nível

Para resolver isso de forma elegante, sem usar *classes utilitárias* espalhadas ou JavaScript invasivo para manipular o HTML, adotamos o estado da arte do Angular moderno:

```typescript
@Input() 
@HostBinding('attr.data-width') 
width: 'auto' | 'full' = 'auto';
```


| Parte do Código | Função no Sistema | O que ela faz na prática? |
| :--- | :--- | :--- |
| **`@Input()`** | Porta de Entrada | Permite que o componente pai envie o valor (`"full"` ou `"auto"`). |
| **`@HostBinding()`** | Espelho Automático | Captura o valor da variável e o "injeta" como um atributo HTML na tag externa (`<app-button>`). |
| **`attr.data-width`** | Semântica Web | Cria um atributo limpo (`data-width="full"`) que o CSS consegue ler instantaneamente. |

#### 🔄 O DOM do Navegador: Antes vs. Depois

Veja a diferença brutal no HTML que o navegador renderiza após essa linha de código:

```html
<!-- 🛑 ANTES (Sem HostBinding): A casca está vazia. O Flexbox do pai ignora o botão. -->
<app-button> 
  <button class="custom-button" data-width="full">Exportar</button>
</app-button>

<!-- ✅ DEPOIS (Com HostBinding): A casca ganha o atributo e o Flexbox assume o controle! -->
<app-button data-width="full"> 
  <button class="custom-button" data-width="full">Exportar</button>
</app-button>
```


### 🎨 Conectando com o SCSS (`:host`)

Com o atributo injetado na casca do componente, usamos o seletor especial **`:host`** no SCSS do filho. Ele diz ao navegador para estilizar a própria tag `<app-button>` de fora:

```scss
// No arquivo custom-button.component.scss
:host {
  display: inline-flex;

  // Se a minha própria CASCA tiver o atributo data-width="full"...
  &[data-width="full"] {
    width: 100%;       // Ocupa todo o espaço (os 45% delimitados pelo pai)
    flex-basis: 100%;  // Avisa ao Flexbox do pai para empurrá-lo para uma nova linha!
  }
}
```


#### 💡 Quando e por que usar essa abordagem?

* **Por que adotamos?** Porque respeita o **Encapsulamento de Componentes** e o **Clean Code**. O componente pai se preocupa apenas em definir o espaço da tela (`width: 45%`), e o botão gerencia autonomamente como ele vai se comportar dentro desse limite.
* **Quando usar?** Sempre que você estiver construindo componentes reutilizáveis (como botões, inputs, cards ou modais) que precisam responder e se alinhar dinamicamente aos layouts de Grid ou Flexbox dos componentes pais.



## 🎨 Demonstração Visual

- **Estrutura inicial dos botões reutilizáveis em Angular**

![Base dos botões](./src/assets/2-initial-angular-reusable-buttons-cida-luna-frontend.png)


- **Botões reutilizáveis ganhando identidade visual**

![Botões com estilo](./src/assets/3-initial-angular-reusable-buttons-cida-luna-frontend.png)


- **Botões avançando com ícones e variantes de estilos**

![Botões com variantes de estilo](./src/assets/4-initial-angular-reusable-buttons-cida-luna-frontend.png)
