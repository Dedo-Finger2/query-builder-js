## Query Builder Vanilla

Este projeto consiste em um query builder feito inteiramente com Javascript, evitando ao máximo de bibliotecas. 
O projeto foi produzido seguindo a metodologia TDD (Test-Driven Development) para garantir a integridade do projeto e manutenibilidade do mesmo em tempos futuros,
além de garantir confiança ao código, principalmente porque foi feito com Javascript.

## Tecnologias usadas

- Vitest [ Biblioteca de testes automatizados ];

## Requisitos funcionais

- [x] Dever ser possível estabelecer um objeto de conexão com o banco de dados usando um driver nativo
- [x] Dever ser possível construir uma query usando method chaining
- [x] Dever ser possível construir uma query dos principais comandos DML (SELECT, INSERT, UPDATE, DELETE)
- [x] Dever ser possível adicionar funções auxiliares na execução dos códigos SQL (having, where, from, etc...)
- [x] Dever ser possível obter a query construída no final através de um atributo
- [x] Dever ser possível executar a query construída
- [x] Dever ser possível utilizar qualquer cliente de banco de dados relacional
- [] Dever ser possível adicionar o operador OR livremente nas queries
- [] Dever ser possível adicionar o operador AND livremente nas queries
- [] Dever ser possível adicionar o operador NOT livremente nas queries

## Regras de negócio

- [] Não deve ser possível criar uma query com operadores inválidos
- [] Não deve ser possível construir uma query de ordenação que use quaisquer valor fora de ASC ou DESC
- [] Não deve ser possível construir uma query usando operador LIKE que não use algum wildcard (%, _)