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
      name: {
        value: "fake_name",
      },
    };

    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)._query;

    expect(query).toBe("SELECT * FROM fake_table_name WHERE name='fake_name'");
  });

  it("should return a SELECT query string with multiple where clause when calling queryBuilder.table.select._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const whereProps = {
      name: {
        value: "fake_name",
      },
      email: {
        value: "fake_email",
      },
      age: {
        value: 1,
      },
    };

    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)._query;

    expect(query).toBe(
      "SELECT * FROM fake_table_name WHERE name='fake_name' AND email='fake_email' AND age=1",
    );
  });

  it("should return a SELECT query string with where clause using LIKE when calling queryBuilder.table.select._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const whereProps = {
      name: {
        value: "%fake_name%",
        operator: "LIKE",
      },
      email: {
        value: "fake_email",
      },
      age: {
        value: 1,
      },
    };

    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)._query;

    expect(query).toBe(
      "SELECT * FROM fake_table_name WHERE name LIKE '%fake_name%' AND email='fake_email' AND age=1",
    );
  });

  it("should return a SELECT query string with where clause using any operator when calling queryBuilder.table.select._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const whereProps = {
      name: {
        value: "fake_name",
      },
      email: {
        value: "fake_email",
      },
      age: {
        value: 1,
        operator: ">",
      },
      fingers: {
        value: 9,
        operator: "<=",
      },
    };

    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)._query;

    expect(query).toBe(
      "SELECT * FROM fake_table_name WHERE name='fake_name' AND email='fake_email' AND age > 1 AND fingers <= 9",
    );
  });

  it("should return a SELECT query string with orderBy clause on queryBuilder.table.select._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const whereProps = {
      name: {
        value: "fake_name",
      },
      email: {
        value: "fake_email",
      },
      age: {
        value: 1,
      },
    };
    const orderByProps = [{ column: "name", orientation: "ASC" }];

    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)
      .orderBy(orderByProps)._query;

    expect(query).toBe(
      "SELECT * FROM fake_table_name WHERE name='fake_name' AND email='fake_email' AND age=1 ORDER BY name ASC",
    );
  });

  it("should return a SELECT query string with multiple orderBy clauses on queryBuilder.table.select._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const whereProps = {
      name: {
        value: "fake_name",
      },
      email: {
        value: "fake_email",
      },
      age: {
        value: 1,
      },
    };
    const orderByProps = [
      { column: "name", orientation: "ASC" },
      { column: "email", orientation: "DESC" },
      { column: "age" },
    ];

    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)
      .orderBy(orderByProps)._query;

    expect(query).toBe(
      "SELECT * FROM fake_table_name WHERE name='fake_name' AND email='fake_email' AND age=1 ORDER BY name ASC,email DESC,age ASC",
    );
  });

  it("should return a SELECT query string using having clause on queryBuilder.table.select._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const whereProps = {
      name: {
        value: "fake_name",
      },
      email: {
        value: "fake_email",
      },
      age: {
        value: 1,
      },
    };
    const havingProps = [{ field: "COUNT(id)", operator: ">", value: 1 }];

    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)
      .having(havingProps)._query;

    expect(query).toBe(
      "SELECT * FROM fake_table_name WHERE name='fake_name' AND email='fake_email' AND age=1 HAVING COUNT(id) > 1",
    );
  });
});
