module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('employees', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      days: {
        type: Sequelize.ARRAY(Sequelize.DATE),
        // defaultValue: [new Date()],
      },
      salary: {
        type: Sequelize.FLOAT,
      },
      unpaid: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    }),

  down: (queryInterface) => queryInterface.dropTable('employees'),
};
