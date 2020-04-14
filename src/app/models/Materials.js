const Sequelize = require('sequelize');
const { Model } = require('sequelize');

class Material extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        type: Sequelize.STRING,
        buy_price: Sequelize.FLOAT,
        sell_price: Sequelize.FLOAT,
        amount: Sequelize.FLOAT,
      },
      { sequelize }
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.Transaction, {
      foreignKey: 'material_id',
      as: 'stored',
    });
  }
}
module.exports = Material;
