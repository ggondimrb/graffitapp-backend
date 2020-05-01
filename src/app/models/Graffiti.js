import Sequelize, { Model } from "sequelize";

class Graffiti extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        description: Sequelize.STRING
      },
      {
        sequelize
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
  }
}

export default Graffiti;
