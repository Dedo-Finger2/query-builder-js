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

  it("should create a new query builder", () => {
    const { queryBuilder, connectionProps, queryBuilderProps } = makeSut();

    expect(queryBuilder).toBeInstanceOf(QueryBuilder);
    expect(queryBuilder.connection.host).toBe(connectionProps.host);
    expect(queryBuilder.client).toBe(queryBuilderProps.client);
  });
});
