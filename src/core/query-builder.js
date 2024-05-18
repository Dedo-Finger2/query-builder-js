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
    this.queryString += `INSERT INTO ${this.tableName} (${columns.join()}) VALUES (${values.map((value) => `'${value}'`).join()})`;
    return this;
  }

  get _table() {
    return this.tableName;
  }

  get _query() {
    return this.queryString;
  }
}
