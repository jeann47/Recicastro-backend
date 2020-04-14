const Sequelize = require('sequelize');
const { Model } = require('sequelize');

class Workflow extends Model {
  static init(sequelize) {
    super.init(
      {
        paid: Sequelize.BOOLEAN,
      },
      { sequelize }
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.Storage, {
      foreignKey: 'workflow_id',
      as: 'stored',
    });
    this.belongsTo(models.Employee, {
      foreignKey: 'employee_id',
      as: 'employee',
    });
  }
}
module.exports = Workflow;
