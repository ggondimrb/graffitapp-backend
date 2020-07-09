import Sequelize, { Model, DataTypes } from "sequelize";

class Graffiti extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        description: Sequelize.STRING,
        artist_name: Sequelize.STRING,
        point: DataTypes.GEOMETRY("POINT")
      },
      {
        sequelize
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });

    this.hasMany(models.File, { foreignKey: "graffiti_id", as: "images" });
  }
}

export default Graffiti;
