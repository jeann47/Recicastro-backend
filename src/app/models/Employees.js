const Sequelize = require('sequelize');
const { Model } = require('sequelize');

class Employee extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        salary: Sequelize.FLOAT,
      },
      { sequelize }
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.Workflow, {
      foreignKey: 'employee_id',
      as: 'workflows',
    });
  }
}

module.exports = Employee;
