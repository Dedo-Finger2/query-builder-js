export class QueryBuilder {
  client;
  connection;
  tableName;
  queryString;

  constructor({ client, connection }) {
    this.client = client;
    this.connection = connection;
    this.tableName = "";
    this.queryString = "";
  }

  table(tableName) {
    this.tableName = tableName;
    return this;
  }

  insert(columnValuePairs) {
    const columns = Object.keys(columnValuePairs);
    const values = Object.values(columnValuePairs);
    this.queryString = `INSERT INTO ${this.tableName} (${columns.join()}) VALUES (${values.map((value) => `'${value}'`).join()})`;
    return this;
  }

  select(columns = "*") {
    switch (columns) {
      case Array.isArray(columns):
        this.queryString = `SELECT ${columns.join()} FROM ${this.tableName}`;
        break;
      default:
        this.queryString = `SELECT ${columns} FROM ${this.tableName}`;
        break;
    }
    return this;
  }

  /**
   * TODO: REFACTOR: Does not work the way I wanted.
   * I hae to say columnOperator || "=" instead of just using the variable
   */
  where(columnValuePairs) {
    const columns = Object.keys(columnValuePairs);
    const whereClause = columns.map((column) => {
      const columnValue = columnValuePairs[column].value;
      const isValueANumber = !Number.isNaN(Number(columnValue));
      const columnOperator = columnValuePairs[column].operator
        ? ` ${columnValuePairs[column].operator} `
        : "=";
      return `${column}${columnOperator}${isValueANumber ? columnValue : `'${columnValue}'`}`;
    });
    this.queryString += ` WHERE ${whereClause.join(" AND ")}`;
    return this;
  }

  orderBy(columnOrientationPairs) {
    this.queryString += " ORDER BY ";
    columnOrientationPairs.map((order) => {
      this.queryString += `${order.column} ${order.orientation.toUpperCase()}`;
    });
    return this;
  }

  get _table() {
    return this.tableName;
  }

  get _query() {
    return this.queryString;
  }
}
