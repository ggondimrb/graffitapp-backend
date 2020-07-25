import Sequelize, { Model } from "sequelize";

class Comment extends Model {
  static init(sequelize) {
    super.init(
      {
        comment: Sequelize.STRING
      },
      {
        sequelize
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });

    this.belongsTo(models.Graffiti, {
      foreignKey: "graffiti_id",
      as: "graffiti"
    });
  }
}

export default Comment;
