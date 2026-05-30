# Angular Reusable Button

Esse projeto foi criado com [Angular CLI](https://github.com/angular/angular-cli) versão 18.2.19.
O objetivo dessa aplicação não é apenas exibir um botão na tela, e sim navegar pelos benefícios que o uso de um botão reutilizável traz para a arquitetura frontend.

### 📋 Pré-Requisitos
- Node.js 18
- Angular CLI 18.2.19

### Gerar ids para os botões na camada frontend
Poderíamos usar nos botões reutilizáveis IDs simples como 1, 2 e 3. Mas se tivermos múltiplos desenvolvedores usando nosso botão em várias telas ao mesmo tempo, os IDs vão colidir e quebrar os testes automatizados do projeto. Por isso, criamos um mecanismo nativo e seguro usando a API de criptografia do próprio navegador para gerar chaves alfanuméricas únicas. E para garantir segurança, usamos um validador na memória para que um botão nunca copie o ID do outro!
Exemplo:
angular-reusable-button-vry833
angular-reusable-button-694kac

## 🚀 Como rodar a aplicação

1. **Clone o repositório:**
  ```bash
    git clone https://github.com/cidaluna/angular-reusable-button.git
  ```

2. **Navegue no diretório principal**
```bash
  cd angular-reusable-button
```

3. **No diretório do projeto execute o comando**
  ```bash 
    npm install
  ```

4. **Em seguida, execute a aplicação**
  ```bash 
    ng serve
  ```

5. **Navegue na URL que o comando anterior apresentou**
  ```bash 
    http://localhost:4200/
  ```

##  Aprendizados
##  O Mistério do Componente "Casca" e o Poder do `@HostBinding`

Se você já tentou criar um componente reutilizável em Angular e usou Flexbox no componente pai, provavelmente se deparou com um bug invisível: **o botão com largura `width="full"` simplesmente recusa-se a esticar ou quebrar a linha**, mesmo com o CSS interno configurado perfeitamente.

Por que isso acontece? Vamos entender a anatomia oculta do Angular no navegador:

### 🕵️‍♂️ O Problema Oculto: A Tag `<app-button>`

Quando consumimos nosso componente em uma página pai, escrevemos assim:
```html
<div class="home__buttons">
  <app-button width="full">Avançar</app-button>
</div>
```

Para o navegador, a tag `<app-button>` funciona como uma **caixa externa invisível (uma "casca")**, e o botão real (`<button class="custom-button">`) fica escondido lá dentro. 

O Flexbox do pai (`.home__buttons`) só consegue enxergar e aplicar regras de layout na **casca**. Como a casca não tem propriedades flexíveis nativas, o botão interno tenta esticar para `100%`, mas fica preso em uma caixa sem largura definida.

---

### 🚀 A Solução Arquitetural: Engenharia de Alto Nível

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
  <button class="custom-button" data-width="full">Avançar</button>
</app-button>

<!-- ✅ DEPOIS (Com HostBinding): A casca ganha o atributo e o Flexbox assume o controle! -->
<app-button data-width="full"> 
  <button class="custom-button" data-width="full">Avançar</button>
</app-button>
```

---

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

---

### 💡 Quando e por que usar essa abordagem?

* **Por que adotamos?** Porque respeita o **Encapsulamento de Componentes** e o **Clean Code**. O componente pai se preocupa apenas em definir o espaço da tela (`width: 45%`), e o botão gerencia autonomamente como ele vai se comportar dentro desse limite.
* **Quando usar?** Sempre que você estiver construindo componentes reutilizáveis (como botões, inputs, cards ou modais) que precisam responder e se alinhar dinamicamente aos layouts de Grid ou Flexbox dos componentes pais.



## 🎨 Demonstração Visual

- **Estrutura inicial dos botões reutilizáveis em Angular**

![Base dos botões](./src/assets/2-initial-angular-reusable-buttons-cida-luna-frontend.png)


- **Botões reutilizáveis ganhando identidade visual**

![Botões com estilo](./src/assets/3-initial-angular-reusable-buttons-cida-luna-frontend.png)


- **Botões avançando com ícones e variantes de estilos**

![Botões com variantes de estilo](./src/assets/4-initial-angular-reusable-buttons-cida-luna-frontend.png)
