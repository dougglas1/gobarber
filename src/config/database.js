module.exports = {
  dialect: 'postgres', // Utilizar o tipo de Banco Postgres
  host: 'localhost', // Local
  username: 'postgres', // Usuário do Banco
  password: 'docker', // Senha do Banco
  database: 'gobarber', // Nome da Base de Dados
  define: {
    timestamps: true, // Data de criação e edição de cada registro
    underscored: true,
    underscoredAll: true,
  },
};

// Utilizando o underscored é formato que deixará o nome
// Exemplo: Model é UserGroup e normal seria UserGroups
// utilizando o padrão definido será user_groups
