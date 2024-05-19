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

  update(columnValuePairs) {
    this.queryString = `UPDATE ${this.tableName} SET `;
    const updateProps = columnValuePairs.map((updateObj) => {
      const isNewValueANumber = !Number.isNaN(Number(updateObj.newValue));
      const formattedValue = isNewValueANumber
        ? updateObj.newValue
        : `'${updateObj.newValue}'`;
      return `${updateObj.column} = ${formattedValue}`;
    });
    this.queryString += updateProps.join(", ");
    return this;
  }

  delete() {
    this.queryString = `DELETE FROM ${this.tableName}`;
    return this;
  }

  join(joinProps) {
    joinProps.map((joinObj) => {
      this.#setJoinMethod(joinObj.joinOrientation);
      this.queryString += `${joinObj.table} ON ${this.tableName}.${joinObj.thisTableProperty} ${joinObj.operator} ${joinObj.table}.${joinObj.otherTableProperty}`;
    });
    return this;
  }

  #setJoinMethod(input) {
    switch (input.toUpperCase()) {
      case "INNER JOIN":
        this.queryString += " INNER JOIN ";
        break;
      case "LEFT JOIN":
        this.queryString += " LEFT JOIN ";
        break;
      case "RIGHT JOIN":
        this.queryString += " RIGHT JOIN ";
        break;
      case "UNION JOIN":
        this.queryString += " UNION JOIN ";
        break;
      default:
        throw new Error("Invalid join method.");
    }
  }

  /**
   * TODO: REFACTOR: Does not work the way I wanted.
   * I hae to say columnOperator || "=" instead of just using the variable
   */
  where(columnValuePairs) {
    const columns = Object.keys(columnValuePairs);
    const whereClause = columns.map((column) => {
      let columnValue = columnValuePairs[column].value;
      const isColumnsValueAnArray = Array.isArray(columnValue);
      const isValueANumber = !Number.isNaN(Number(columnValue));
      const columnOperator = columnValuePairs[column].operator
        ? ` ${columnValuePairs[column].operator} `
        : "=";
      if (isColumnsValueAnArray && columnValuePairs[column].operator === "IN") {
        columnValue = `(${columnValue
          .map((column) => {
            return `'${column}'`;
          })
          .join()})`;
        return `${column}${columnOperator}${columnValue}`;
      }
      if (
        isColumnsValueAnArray &&
        columnValuePairs[column].operator === "BETWEEN"
      ) {
        columnValue = `${columnValue
          .map((column) => {
            return `'${column}'`;
          })
          .join(" AND ")}`;
        return `${column}${columnOperator}${columnValue}`;
      }
      return `${column}${columnOperator}${isValueANumber ? columnValue : `'${columnValue}'`}`;
    });
    this.queryString += ` WHERE ${whereClause.join(" AND ")}`;
    return this;
  }

  orWhere(columnValuePairs) {
    const columns = Object.keys(columnValuePairs);
    const whereClause = columns.map((column) => {
      const columnValue = columnValuePairs[column].value;
      const isValueANumber = !Number.isNaN(Number(columnValue));
      const columnOperator = columnValuePairs[column].operator
        ? ` ${columnValuePairs[column].operator} `
        : "=";
      return `${column}${columnOperator}${isValueANumber ? columnValue : `'${columnValue}'`}`;
    });
    this.queryString += ` OR ${whereClause.join(" OR ")}`;
    return this;
  }

  notWhere(columnValuePairs) {
    const columns = Object.keys(columnValuePairs);
    const whereClause = columns.map((column) => {
      const columnValue = columnValuePairs[column].value;
      const isValueANumber = !Number.isNaN(Number(columnValue));
      const columnOperator = columnValuePairs[column].operator
        ? ` ${columnValuePairs[column].operator} `
        : "=";
      return `${column}${columnOperator}${isValueANumber ? columnValue : `'${columnValue}'`}`;
    });
    const queryStringDoesNotHaveWhereClause =
      !this.queryString.includes("WHERE");
    if (queryStringDoesNotHaveWhereClause) {
      this.queryString += " WHERE NOT ";
      this.queryString += `${whereClause.join(" AND NOT ")}`;
      return this;
    }
    this.queryString += ` NOT ${whereClause.join(" AND NOT ")}`;
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
