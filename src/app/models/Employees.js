import Sequelize, { Model } from 'sequelize';

class Employee extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        days: Sequelize.ARRAY(Sequelize.DATE),
        salary: Sequelize.FLOAT,
        unpaid: Sequelize.INTEGER,
      },
      { sequelize }
    );
    return this;
  }
}

export default Employee;
