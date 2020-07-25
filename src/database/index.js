import Sequelize from "sequelize";

import User from "../app/models/User";
import File from "../app/models/File";
import Graffiti from "../app/models/Graffiti";
import Like from "../app/models/Like";
import Comment from "../app/models/Comment";

import databaseConfig from "../config/database";

const models = [User, File, Graffiti, Like, Comment];

class Database {
  constructor() {
    this.init();
    //    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  // mongo() {
  //   this.mongoConnection = mongoose.connect(`${process.env.MONGO_URL}`, {
  //     useNewUrlParser: true,
  //     useFindAndModify: true
  //   });
  // }
}

export default new Database();
