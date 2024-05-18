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
    const defaultOrientation = "ASC";
    const orderByProps = columnOrientationPairs.map((order) => {
      return `${order.column} ${order?.orientation ? order?.orientation.toUpperCase() : defaultOrientation}`;
    });
    this.queryString += orderByProps.join();
    return this;
  }

  having(fieldOperationValuePairs) {
    this.queryString += " HAVING ";
    const havingProps = fieldOperationValuePairs.map((havingObj) => {
      console.log(havingObj);
      const conditionOperator = havingObj.operator
        ? ` ${havingObj.operator} `
        : "=";
      return `${havingObj.field}${conditionOperator}${havingObj.value}`;
    });
    this.queryString += havingProps.join(" AND ");
    return this;
  }

  limit(amount) {
    this.queryString += ` LIMIT ${amount}`;
    return this;
  }

  offset(amount) {
    this.queryString += ` OFFSET ${amount}`;
    return this;
  }

  groupBy(columns) {
    this.queryString += " GROUP BY ";
    this.queryString += columns.join();
    return this;
  }

  get _table() {
    return this.tableName;
  }

  get _query() {
    return this.queryString;
  }
}
