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

## 🎨 Demonstração Visual

- Tela Home iniciando os botões

![Home](./src/assets/2-initial-angular-reusable-buttons-cida-luna-frontend.png)


- Botões reutilizáveis ganhando estilos

![Home](./src/assets/3-initial-angular-reusable-buttons-cida-luna-frontend.png)

