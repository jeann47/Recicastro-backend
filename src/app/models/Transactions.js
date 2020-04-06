import Sequelize, { Model } from 'sequelize';

class Transaction extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        in_out: Sequelize.BOOLEAN,
        price: Sequelize.FLOAT,
        ammount: Sequelize.FLOAT,
        note: Sequelize.STRING,
      },
      { sequelize }
    );
    return this;
  }
}

export default Transaction;
