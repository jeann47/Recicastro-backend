import Sequelize, { Model } from 'sequelize';

class Storage extends Model {
  static init(sequelize) {
    super.init(
      {
        ammount: Sequelize.FLOAT,
        sold: Sequelize.BOOLEAN,
      },
      { sequelize }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Material, {
      foreignKey: 'material_id',
      as: 'material',
    });
    this.belongsTo(models.Employee, {
      foreignKey: 'employee_id',
      as: 'employee',
    });
  }
}

export default Storage;
