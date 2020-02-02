// up é utilizado quando a migration for executada
// down é utilizado quando a migration for feito rollback

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        alloNull: false, // Não permite nulo
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        alloNull: false,
      },
      email: {
        type: Sequelize.STRING,
        alloNull: false,
        unique: true, // Não permitir e-mail repetido
      },
      password_hash: {
        type: Sequelize.STRING,
        alloNull: false,
      },
      provider: {
        type: Sequelize.BOOLEAN,
        defaultValue: false, // Inicializar como Cliente
      },
      created_at: {
        type: Sequelize.DATE,
        alloNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        alloNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('users');
  },
};
