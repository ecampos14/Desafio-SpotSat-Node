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
7. DELETE /v4/places/:id
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

##  GET /v5/places 
Retorna uma lista de lugares com informações geográficas em formato GeoJSON.
Exemplo de resposta:
```json
 {
        "id": 1,
        "name": "Local A",
        "point": {
            "type": "Point",
            "coordinates": [
                -47.892,
                -15.793
            ]
        }
    },
    {
        "id": 2,
        "name": "Local B",
        "point": {
            "type": "Point",
            "coordinates": [
                -47.896,
                -15.799
            ]
        }
    }
  ````
  
  
## GET /v5/places/{id}
Retorna um lugar específico pelo seu ID em formato GeoJSON.
Exemplo de resposta:
```json
    {
        "id": 2,
        "name": "Local B",
        "point": {
            "type": "Point",
            "coordinates": [
                -47.896,
                -15.799
            ]
        }
    }
  ````

## POST /v5/places
Cria um novo lugar com informações geográficas a partir de um objeto GeoJSON.
Exemplo de body:
````json
{
  "name": "Local C",
  "point": {
    "type": "Point",
    "coordinates": [-23.221112, -23.221112]
  }
}
````

## PUT /v5/places/{id} 
Atualiza um lugar específico pelo seu ID a partir de um objeto GeoJSON com as informações a serem atualizadas.
Exemplo de body:
````json
{
  "name": "Local C",
  "point": {
    "type": "Point",
    "coordinates": [-23.221112, -23.221112]
  }
}
````
## DELETE  /v5/places/{id} 
Deleta um lugar específico pelo seu ID.
Exemplo de resposta:

````
Lugar removido com sucesso
````
## GET /v5/areas
Retorna uma lista de áreas em formato GeoJSON.
Exemplo de resposta:
````json
{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -43.950725,
                            -19.864171
                        ],
                        [
                            -43.947458,
                            -19.863508
                        ],
                        [
                            -43.948944,
                            -19.860419
                        ],
                        [
                            -43.951935,
                            -19.861112
                        ],
                        [
                            -43.950725,
                            -19.864171
                        ]
                    ]
                ]
            },
            "properties": {
                "id": 1,
                "name": "Área 1"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -43.950725,
                            -19.864171
                        ],
                        [
                            -43.953021,
                            -19.864413
                        ],
                        [
                            -43.952924,
                            -19.862654
                        ],
                        [
                            -43.951175,
                            -19.862727
                        ],
                        [
                            -43.950725,
                            -19.864171
                        ]
                    ]
                ]
            },
            "properties": {
                "id": 2,
                "name": "Área 2"
            }
        }
 ````


## GET /v5/areas/{id}
Retorna uma área específica pelo seu ID.
Exemplo de resposta:
````json
   {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -43.950725,
                            -19.864171
                        ],
                        [
                            -43.953021,
                            -19.864413
                        ],
                        [
                            -43.952924,
                            -19.862654
                        ],
                        [
                            -43.951175,
                            -19.862727
                        ],
                        [
                            -43.950725,
                            -19.864171
                        ]
                    ]
                ]
            },
            "properties": {
                "id": 2,
                "name": "Área 2"
            }
        }
 ````
## POST /v5/areas
Cria uma nova área com informações geográficas a partir de um objeto GeoJSON.
Exemplo de body:
```json
{
  "name": "Area C",
  "polygon": {
    "type": "Polygon",
    "coordinates": [
      [
        [-43.950725, -19.864256],
        [-43.950725, -19.866283],
        [-43.948952, -19.866283],
        [-43.948952, -19.864256],
        [-43.950725, -19.864256]
      ]
    ]
  }
}
````

##  PUT /v5/areas/{id}
Atualiza uma área específico pelo seu ID a partir de um objeto GeoJSON com as informações a serem atualizadas.
Exemplo de body:
```json
{
  "name": "Area C",
  "polygon": {
    "type": "Polygon",
    "coordinates": [
      [
        [-43.950725, -19.864256],
        [-43.950725, -19.866283],
        [-43.948952, -19.866283],
        [-43.948952, -19.864256],
        [-43.950725, -19.864256]
      ]
    ]
  }
}
````
## DELETE /v5/areas/id: Deleta uma área específico pelo seu ID.
Exemplo de resposta:

````
Área removida com sucesso
````

##  GET /v5/places/{id}/areas
Retorna uma lista de áreas que contêm o lugar especificado pelo ID.

Exemplo de resposta:
````json
  {
    "id": 1,
    "name": "Place 1",
    "point": {
      "type": "Point",
      "coordinates": [longitude, latitude]
    },
  },
  {
    "id": 2,
    "name": "Place 2",
    "point": {
      "type": "Point",
      "coordinates": [longitude, latitude]
    },
  }
````

## GET  /v5/places/{placeId}/{areaId}
Verificar se um determinado lugar está dentro de uma determinada área. 
Exemplo de resposta:
````json
{
    "is_within": false
}
````

