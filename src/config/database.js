require('dotenv/config');

module.exports = {
  dialect: 'postgres', // Utilizar o tipo de Banco Postgres
  host: process.env.DB_HOST, // Local
  username: process.env.DB_USER, // Usuário do Banco
  password: process.env.DB_PASS, // Senha do Banco
  database: process.env.DB_NAME, // Nome da Base de Dados
  define: {
    timestamps: true, // Data de criação e edição de cada registro
    underscored: true,
    underscoredAll: true,
  },
};

// Utilizando o underscored é formato que deixará o nome
// Exemplo: Model é UserGroup e normal seria UserGroups
// utilizando o padrão definido será user_groups
