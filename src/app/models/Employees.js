import Sequelize, { Model } from 'sequelize';

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

export default Employee;
