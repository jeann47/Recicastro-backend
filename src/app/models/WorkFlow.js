import Sequelize, { Model } from 'sequelize';

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

export default Workflow;
