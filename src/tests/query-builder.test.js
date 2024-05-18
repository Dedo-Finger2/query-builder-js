import { describe, expect, it } from "vitest";
import { Connection } from "../core/connection";
import { QueryBuilder } from "../core/query-builder";

const makeSut = () => {
  const connectionProps = {
    host: "fake_host",
    user: "fake_user",
    password: "fake_password",
    database: "fake_database",
  };
  const queryBuilderProps = {
    client: "fake_client",
    connection: new Connection(connectionProps),
  };
  const queryBuilder = new QueryBuilder(queryBuilderProps);
  return {
    connectionProps,
    queryBuilderProps,
    queryBuilder,
  };
};

describe("QueryBuilder Class", () => {
  it("should create a new query builder", () => {
    const { queryBuilder, connectionProps, queryBuilderProps } = makeSut();

    expect(queryBuilder).toBeInstanceOf(QueryBuilder);
    expect(queryBuilder.connection.host).toBe(connectionProps.host);
    expect(queryBuilder.client).toBe(queryBuilderProps.client);
  });

  it("should set the table when calling queryBuilder.table", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";

    queryBuilder.table(tableName);

    expect(queryBuilder._table).toBe(tableName);
  });

  it("should return an INSERT query string when calling queryBuilder.table.insert._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const insertProps = {
      name: "fake_name",
      email: "fake_email",
      password: "fake_password",
    };

    const query = queryBuilder.table(tableName).insert(insertProps)._query;

    expect(query).toBe(
      "INSERT INTO fake_table_name (name,email,password) VALUES ('fake_name','fake_email','fake_password')",
    );
  });

  it("should return a SELECT query string when calling queryBuilder.table.select._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const selectProps = ["id", "name", "email"];

    const query = queryBuilder.table(tableName).select(selectProps)._query;

    expect(query).toBe("SELECT id,name,email FROM fake_table_name");
  });

  it("should set columns to * by default using queryBuilder.table.select._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";

    const query = queryBuilder.table(tableName).select()._query;

    expect(query).toBe("SELECT * FROM fake_table_name");
  });

  it("should return a SELECT query string with where clause when calling queryBuilder.table.select._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const whereProps = {
      name: "fake_name",
    };

    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)._query;

    expect(query).toBe("SELECT * FROM fake_table_name WHERE name='fake_name'");
  });
});
