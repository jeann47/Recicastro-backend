const Sequelize = require('sequelize');
const { Model } = require('sequelize');

class Transaction extends Model {
  static init(sequelize) {
    super.init(
      {
        in_out: Sequelize.BOOLEAN,
        price: Sequelize.FLOAT,
        amount: Sequelize.FLOAT,
        note: Sequelize.STRING,
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
  }
}

module.exports = Transaction;
