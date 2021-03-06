const Sequelize = require('sequelize');
const { Model } = require('sequelize');

class Storage extends Model {
  static init(sequelize) {
    super.init(
      {
        amount: Sequelize.FLOAT,
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
    this.belongsTo(models.Workflow, {
      foreignKey: 'workflow_id',
      as: 'workflow',
    });
  }
}

module.exports = Storage;
