const Sequelize = require('sequelize');
const conn = require('../config/database');

const Materials = require('../app/models/Materials');
const Employees = require('../app/models/Employees');
const Storages = require('../app/models/Storages');
const Transactions = require('../app/models/Transactions');
const Workflow = require('../app/models/WorkFlow');

const models = [Materials, Storages, Workflow, Employees, Transactions];

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
module.exports = new Database();
