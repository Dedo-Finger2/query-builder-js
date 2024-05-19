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

  it("should return a SELECT query string using multiple having clause on queryBuilder.table.select._query", () => {
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
    const havingProps = [
      { field: "COUNT(id)", operator: ">", value: 1 },
      { field: "COUNT(name)", operator: "<", value: 1 },
      { field: "COUNT(age)", value: 1 },
    ];

    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)
      .having(havingProps)._query;

    expect(query).toBe(
      "SELECT * FROM fake_table_name WHERE name='fake_name' AND email='fake_email' AND age=1 HAVING COUNT(id) > 1 AND COUNT(name) < 1 AND COUNT(age)=1",
    );
  });

  it("should return a SELECT query string using limit clause on queryBuilder.table.select._query", () => {
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
      .where(whereProps)
      .limit(10)._query;

    expect(query).toBe(
      "SELECT * FROM fake_table_name WHERE name='fake_name' AND email='fake_email' AND age=1 LIMIT 10",
    );
  });

  it("should return a SELECT query string using offset clause on queryBuilder.table.select._query", () => {
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
      .where(whereProps)
      .limit(10)
      .offset(2)._query;

    expect(query).toBe(
      "SELECT * FROM fake_table_name WHERE name='fake_name' AND email='fake_email' AND age=1 LIMIT 10 OFFSET 2",
    );
  });

  it("should return a SELECT query string using group by clause on queryBuilder.table.select._query", () => {
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
    const groupByProps = ["name", "email"];

    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)
      .groupBy(groupByProps)._query;

    expect(query).toBe(
      "SELECT * FROM fake_table_name WHERE name='fake_name' AND email='fake_email' AND age=1 GROUP BY name,email",
    );
  });

  it("should return a UPDATE query string on queryBuilder.table.update._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const updateProps = [
      { column: "name", newValue: "new_fake_name" },
      { column: "age", newValue: 12 },
      { column: "email", newValue: "new_fake_email" },
    ];

    const query = queryBuilder.table(tableName).update(updateProps)._query;

    expect(query).toBe(
      "UPDATE fake_table_name SET name = 'new_fake_name', age = 12, email = 'new_fake_email'",
    );
  });

  it("should return a UPDATE query string with where clause on queryBuilder.table.update._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const updateProps = [
      { column: "name", newValue: "new_fake_name" },
      { column: "age", newValue: 12 },
      { column: "email", newValue: "new_fake_email" },
    ];
    const whereProps = {
      name: { value: "fake_name" },
      email: { value: "fake_email" },
      age: { value: 1 },
    };

    const query = queryBuilder
      .table(tableName)
      .update(updateProps)
      .where(whereProps)._query;

    expect(query).toBe(
      "UPDATE fake_table_name SET name = 'new_fake_name', age = 12, email = 'new_fake_email' WHERE name='fake_name' AND email='fake_email' AND age=1",
    );
  });

  it("should return a DELETE query string on queryBuilder.table.delete._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";

    const query = queryBuilder.table(tableName).delete()._query;

    expect(query).toBe("DELETE FROM fake_table_name");
  });

  it("should return a DELETE query string using where clauses on queryBuilder.table.delete._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const whereProps = {
      name: { value: "fake_name" },
      email: { value: "fake_email" },
      age: { value: 1 },
    };

    const query = queryBuilder
      .table(tableName)
      .delete()
      .where(whereProps)._query;

    expect(query).toBe(
      "DELETE FROM fake_table_name WHERE name='fake_name' AND email='fake_email' AND age=1",
    );
  });

  it("should return a SELECT query string using regular JOIN on queryBuilder.table.select.join._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const whereProps = {
      name: { value: "fake_name" },
      email: { value: "fake_email" },
      age: { value: 1 },
    };
    const joinProps = [
      {
        joinOrientation: "INNER JOIN",
        table: "another_fake_table",
        otherTableProperty: "id",
        operator: "=",
        thisTableProperty: "id",
      },
    ];

    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)
      .join(joinProps)._query;

    expect(query).toBe(
      "SELECT * FROM fake_table_name WHERE name='fake_name' AND email='fake_email' AND age=1 INNER JOIN another_fake_table ON fake_table_name.id = another_fake_table.id",
    );
  });

  it("should return a SELECT query string using multiple JOINs on queryBuilder.table.select.join.join.join._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const whereProps = {
      name: { value: "fake_name" },
      email: { value: "fake_email" },
      age: { value: 1 },
    };
    const joinProps = [
      {
        joinOrientation: "LEFT JOIN",
        table: "another_fake_table_LEFT",
        otherTableProperty: "id",
        operator: "=",
        thisTableProperty: "id",
      },
      {
        joinOrientation: "RIGHT JOIN",
        table: "another_fake_table_RIGHT",
        otherTableProperty: "id",
        operator: ">",
        thisTableProperty: "id",
      },
      {
        joinOrientation: "INNER JOIN",
        table: "another_fake_table_INNER",
        otherTableProperty: "id",
        operator: "<=",
        thisTableProperty: "id",
      },
    ];

    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)
      .join(joinProps)._query;

    expect(query).toBe(
      "SELECT * FROM fake_table_name WHERE name='fake_name' AND email='fake_email' AND age=1 LEFT JOIN another_fake_table_LEFT ON fake_table_name.id = another_fake_table_LEFT.id RIGHT JOIN another_fake_table_RIGHT ON fake_table_name.id > another_fake_table_RIGHT.id INNER JOIN another_fake_table_INNER ON fake_table_name.id <= another_fake_table_INNER.id",
    );
  });
});
