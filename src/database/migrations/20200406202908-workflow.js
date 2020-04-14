module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('workflows', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      paid: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      employee_id: {
        type: Sequelize.INTEGER,
        references: { model: 'employees', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false,
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

  down: (queryInterface) => queryInterface.dropTable('workflows'),
};
