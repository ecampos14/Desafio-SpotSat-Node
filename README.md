# Desafio Backend

Este é um desafio de backend que consiste em desenvolver uma JSON REST API para lidar com dados geográficos, como mapeamento de áreas e localização de clientes. O desafio está dividido em várias partes, cada uma com um nível de dificuldade crescente. Não é necessário implementar todas as partes, mas quanto mais você conseguir completar, melhor será avaliado.


## Configuração

1. Clone o repositório para o seu ambiente de desenvolvimento local;
2. Acesse o diretório do projeto;
3. Instale as dependências do projeto;
4. Configure o ambiente  na raiz do projeto e preenchendo as variáveis do banco com a suasconfigurações;
Certifique-se de substituir `host-do-banco-de-dados`, `porta-do-banco-de-dados`, `nome-do-banco-de-dados`, `usuario-do-banco-de-dados`, `senha-do-banco-de-dados` e `chave-secreta-do-jwt` com as informações corretas.
5. Execute as migrações do banco de dados para criar as tabelas necessárias:
6. Inicie o servidor rodando node app.js no terminal. 


O servidor será iniciado na porta 8083

## Endpoints

### 1. GET /v1/

Retorna uma mensagem padrão com status 200 OK.

Exemplo de resposta:
```json
{
  "message": "Bem vindo a API GeoPoly!"
}
```
### 2. POST /v1/auth

Simula uma rota de autenticação (não é necessário implementar uma autenticação real). Retorna uma das possíveis respostas dependendo do corpo da requisição.

Exemplo de requisição:

```json

{
  "email": "admin@exemplo.com.br",
  "password": "abcd1234"
}
````
Exemplo de resposta (200 OK) para caso as credenciais estejam corretas:
```json
{
  "message": "Autenticado com sucesso!"
}
````
Exemplo de resposta (400 Bad Request) para caso o formato do corpo da requisição (nome dos atributos errados e/ou atributos a mais ou a menos) esteja incorreto:
```json
{
  "message": "Formato da requisição inválido!"
}
````
###3. GET /v2/places

Retorna uma lista de lugares com informações geográficas em formato JSON.

Exemplo de resposta (lugares em São José dos Campos - SP):

```json
[
  {
    "id": 1,
    "name": "Parque da Cidade",
    "latitude": -23.221112,
    "longitude": -45.899678
  },
  {
    "id": 2,
    "name": "Praça Ulisses Guimarães",
    "latitude": -23.180038,
    "longitude": -45.88435
    
 {
 ]
 ````
## 4. GET /v2/places/:id
Retorna um lugar específico da lista acima pelo seu ID em formato JSON.

Exemplo de resposta:

```json
[
  {
    "id": 1,
    "name": "Parque da Cidade",
    "latitude": -23.221112,
    "longitude": -45.899678
  }
 ````
 Refazer as rotas acima em `/v2/places` porém agora persistindo os dados. Esta nova implementação deve estar em `/v3/places`. E incluir essas outras rotas:

### 5. POST /v3/places

Cria um novo lugar com informações geográficas a partir de um objeto JSON.

Exemplo de requisição:
```json
 {
  "id": 5,
  "name": "Lago do Vale",
  "latitude": -23.200443,
  "longitude": -45.896235
}
``````
6. PUT /places/:id
Atualiza um lugar específico pelo seu ID a partir de um objeto JSON com as informações a serem atualizadas.

Exemplo de requisição:
```json
{
  "name": "Parque da Cidade - São José dos Campos",
  "latitude": -23.221112,
  "longitude": -45.899678
}
````
7. DELETE /places/:id
Deleta um lugar específico pelo seu ID.

Exemplo de resposta:

```json
{
  "message": "Lugar removido com sucesso!"
}
````
