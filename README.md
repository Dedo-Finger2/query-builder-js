## Query Builder Vanilla

Este projeto consiste em um query builder feito inteiramente com Javascript, evitando ao máximo de bibliotecas. 
O projeto foi produzido seguindo a metodologia TDD (Test-Driven Development) para garantir a integridade do projeto e manutenibilidade do mesmo em tempos futuros,
além de garantir confiança ao código, principalmente porque foi feito com Javascript.

## Tecnologias usadas

- Vitest [ Biblioteca de testes automatizados ];
- EsLint [ Biblioteca de linting ];
- Prettier [ Biblioteca estilização e padronização de código ];
- Husky [ Biblioteca execução de tarefas entre ações do Git ];
- Pg [ Driver nativo do PostgreSQL ];

## Requisitos funcionais

- [x] Dever ser possível estabelecer um objeto de conexão com o banco de dados usando um driver nativo
- [x] Dever ser possível construir uma query usando method chaining
- [x] Dever ser possível construir uma query dos principais comandos DML (SELECT, INSERT, UPDATE, DELETE)
- [x] Dever ser possível adicionar funções auxiliares na execução dos códigos SQL (having, where, from, etc...)
- [x] Dever ser possível obter a query construída no final através de um atributo
- [x] Dever ser possível executar a query construída
- [x] Dever ser possível utilizar qualquer cliente de banco de dados relacional

## Regras de negócio

- [x] Não deve ser possível criar uma query com operadores inválidos
- [x] Não deve ser possível construir uma query de ordenação que use quaisquer valor fora de ASC ou DESC
- [x] Não deve ser possível construir uma query usando operador LIKE que não use algum wildcard (%, _)