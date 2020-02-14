import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

// sequelize como parâmetro se refere a conexão
class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // Virtual não existe no BD
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    // Acionado antes de ser salvo no BD (Inserir ou Atualizar)
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  // hasOnde > ID do usuário na tabela Arquivos
  // hasMany > ID do usuário com vários na tabela de Arquivos
  // belongsTo > ID do Arquivo na tabela de Usuários
  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
