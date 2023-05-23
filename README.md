# Desafio Backend

Este é um desafio de backend que consiste em desenvolver uma JSON REST API para lidar com dados geográficos, como mapeamento de áreas e localização de clientes. O desafio está dividido em várias partes, cada uma com um nível de dificuldade crescente. Não é necessário implementar todas as partes, mas quanto mais você conseguir completar, melhor será avaliado.


## Configuração

1. Clone o repositório para o seu ambiente de desenvolvimento local;

      ``https://github.com/ecampos14/Desafio-SpotSat-Node``
3. Acesse o diretório do projeto;
4. Instale as dependências do projeto;
`npm install`
6. Configure o ambiente  na raiz do projeto e preenchendo as variáveis do banco com a suasconfigurações;
Certifique-se de substituir `host-do-banco-de-dados`, `porta-do-banco-de-dados`, `nome-do-banco-de-dados`, `usuario-do-banco-de-dados`, `senha-do-banco-de-dados` e `chave-secreta-do-jwt` com as informações corretas.
5. Execute as migrações do banco de dados para criar as tabelas necessárias:
6. Inicie o servidor rodando `node app.js` no terminal. 


O servidor será iniciado na porta 8083


## Configuração do Banco de Dados

1. Crie um banco de dados no PostgreSQL:

```sql
CREATE DATABASE db_spotsat;
```
```sql
CREATE TABLE places (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  point POINT
);
````
```sql
CREATE TABLE areas (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  polygon GEOMETRY(Polygon, 4326)
);
````

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
 
 ````
## 4. GET /v2/places/:id
Retorna um lugar específico da lista acima pelo seu ID em formato JSON.

Exemplo de resposta:

```json

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

### 8. GET /v4/places/:id1/distanceto/:id2

Retorna a distância entre 2 pontos.

Exemplo de resposta:

```json
{
  "distance": 1300.00
}

````
## 9. GET /v4/search?latitude={latitude}&longitude={longitude}&radius={radius}
Retorna uma lista de lugares e/ou áreas em um raio específico a partir de uma localização central (latitude e longitude) e um raio em metros. Cada lugar deve incluir a distância do ponto central especificado.

Exemplo de resposta:
```json
  {
    "id": 1,
    "name": "Parque da Cidade",
    "latitude": -23.221112,
    "longitude": -45.899678,
    "distance": 1300.0
  },
  {
    "id": 2,
    "name": "Praça Ulisses Guimarães",
    "latitude": -23.180038,
    "longitude": -45.884357,
    "distance": 5000.0
  },
  {
    "id": 3,
    "name": "Shopping Center Vale",
    "latitude": -23.186732,
    "longitude": -45.884104,
    "distance": 5600.0
  }
```
# API de Gerenciamento de Lugares e Áreas

Esta é uma API RESTful para gerenciamento de lugares e áreas geográficas, utilizando o banco de dados PostgreSQL com a extensão PostGIS. Ela permite criar, visualizar, atualizar e remover lugares e áreas, além de fornecer funcionalidades para pesquisar lugares e áreas dentro de um círculo, calcular a distância entre dois lugares, verificar se um lugar está dentro de uma área e listar lugares dentro de uma área.

## Requisitos

- Node.js
- PostgreSQL com a extensão PostGIS


## Rotas
A API possui as seguintes rotas:

- GET /places: Retorna uma lista de lugares com informações geográficas em formato GeoJSON.
- GET /places/id: Retorna um lugar específico pelo seu ID em formato GeoJSON.
- POST /places: Cria um novo lugar com informações geográficas a partir de um objeto GeoJSON.
- PUT /places/id: Atualiza um lugar específico pelo seu ID a partir de um objeto GeoJSON com as informações a serem atualizadas.
- DELETE /places/id: Deleta um lugar específico pelo seu ID.
- GET /places/search: Retorna uma lista de lugares dentro de um círculo especificado por uma localização central (latitude e longitude) e um raio em metros.
- GET /places/distanceto: Retorna a distância entre dois lugares pelo ID utilizando a projeção adequada.
- GET /places/id/areas: Retorna uma lista de áreas que contêm o lugar especificado pelo ID.
- GET /areas: Retorna uma lista de áreas em formato GeoJSON.
- GET /areas/id: Retorna uma área específica pelo seu ID.
- POST /areas: Cria uma nova área com informações geográficas a partir de um objeto GeoJSON.
- PUT /areas/id: Atualiza uma área específico pelo seu ID a partir de um objeto GeoJSON com as informações a serem atualizadas.
- DELETE /areas/id: Deleta uma área específico pelo seu ID.

