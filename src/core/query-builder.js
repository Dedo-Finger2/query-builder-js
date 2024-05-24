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
   * @param {Array} columnOperatorValuePairsArray
   */
  where(columnOperatorValuePairsArray) {
    const whereClause = columnOperatorValuePairsArray.map(
      (columnOperatorValueObj) => {
        const column = columnOperatorValueObj.column;
        const operator = this.#setDefaultOperator(
          columnOperatorValueObj.operator,
        );
        let value = columnOperatorValueObj.value;
        const isValueAnArray = Array.isArray(value);
        if (isValueAnArray) {
          value = this.#handleArrayValueCases({ operator, value });
          return `${column}${operator}${value}`;
        }
        this.#handleValueUsingLikeOperator({ value, operator });
        return `${column}${operator}${this.#formatValue(value)}`;
      },
    );
    this.queryString += ` WHERE ${whereClause.join(" AND ")}`;
    return this;
  }

  #formatValue(value) {
    const isValueANumber = !Number.isNaN(Number(value));
    return `${isValueANumber ? value : `'${value}'`}`;
  }

  #setDefaultOperator(operator) {
    if (!operator) return " = ";
    switch (operator.trim().toUpperCase()) {
      case "=":
        return ` ${operator} `;
      case ">":
        return ` ${operator} `;
      case "<":
        return ` ${operator} `;
      case ">=":
        return ` ${operator} `;
      case "<=":
        return ` ${operator} `;
      case "<>":
        return ` ${operator} `;
      case "AND":
        return ` ${operator} `;
      case "OR":
        return ` ${operator} `;
      case "NOT":
        return ` ${operator} `;
      case "BETWEEN":
        return ` ${operator} `;
      case "LIKE":
        return ` ${operator} `;
      case "IN":
        return ` ${operator} `;
      case "ALL":
        return ` ${operator} `;
      case "ANY":
        return ` ${operator} `;
      case "SOME":
        return ` ${operator} `;
      case "EXISTS":
        return ` ${operator} `;
      default:
        throw new Error("Invalid operator in where clause.");
    }
  }

  #handleArrayValueCases({ value, operator }) {
    switch (operator.trim()) {
      case "IN":
        value = `(${value
          .map((column) => {
            return this.#formatValue(column);
          })
          .join()})`;
        return `${value}`;
      case "BETWEEN":
        value = `${value
          .map((column) => {
            return this.#formatValue(column);
          })
          .join(" AND ")}`;
        return `${value}`;
      default:
        throw new Error("Invalid Operator.");
    }
  }

  /**
   * @param {{ value: string, operator: string }}
   */
  #handleValueUsingLikeOperator({ value, operator }) {
    if (Array.isArray(value) || Number.isInteger(value)) return;
    const valueHasNoWildcard = !value.includes("%") && !value.includes("_");
    if (operator.trim().toUpperCase() === "LIKE" && valueHasNoWildcard) {
      throw new Error("Invalid value using LIKE operator. Missing wildcard.");
    }
  }

  /**
   * @param {Array} columnOperatorValuePairs
   */
  orWhere(columnOperatorValuePairs) {
    const whereClause = columnOperatorValuePairs.map(
      (columnOperatorValueObj) => {
        const column = columnOperatorValueObj.column;
        const value = columnOperatorValueObj.value;
        const operator = this.#setDefaultOperator(
          columnOperatorValueObj.operator,
        );
        return `${column}${operator}${this.#formatValue(value)}`;
      },
    );
    this.queryString += ` OR ${whereClause.join(" OR ")}`;
    return this;
  }

  /**
   * @param {Array} columnOperatorValuePairs
   */
  notWhere(columnOperatorValuePairs) {
    const whereClause = columnOperatorValuePairs.map(
      (columnOperatorValueObj) => {
        const column = columnOperatorValueObj.column;
        let value = columnOperatorValueObj.value;
        const operator = this.#setDefaultOperator(
          columnOperatorValueObj.operator,
        );
        const isValueAnArray = Array.isArray(value);
        if (isValueAnArray) {
          value = this.#handleArrayValueCases({ operator, value });
          return `${column}${operator}${value}`;
        }
        return `${column}${operator}${this.#formatValue(value)}`;
      },
    );
    this.#addWhereNotIfQueryDoesNotHaveWhereAlready({ whereClause });
    return this;
  }

  #addWhereNotIfQueryDoesNotHaveWhereAlready({ whereClause }) {
    const queryStringDoesNotHaveWhereClause =
      !this.queryString.includes("WHERE");
    if (queryStringDoesNotHaveWhereClause) {
      this.queryString += " WHERE NOT ";
      this.queryString += `${whereClause.join(" AND NOT ")}`;
      return this;
    }
    this.queryString += ` NOT ${whereClause.join(" AND NOT ")}`;
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
