import Sequelize from 'sequelize';
import conn from '../config/database';

import Materials from '../app/models/Materials';
import Employees from '../app/models/Employees';
import Storages from '../app/models/Storages';
import Transactions from '../app/models/Transactions';

const models = [Materials, Employees, Storages, Transactions];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(conn);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

export default new Database();
