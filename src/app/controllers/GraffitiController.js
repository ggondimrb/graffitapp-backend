import * as Yup from "yup";
import Graffiti from "../models/Graffiti";
import File from "../models/File";
import Like from "../models/Like";
import Sequelize, { Op } from "sequelize";

const { findConnections, sendMessage } = require("../../websocket");

class GraffitiController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const { latitude, longitude } = req.query;

    var location = Sequelize.literal(
      `ST_GeomFromText('POINT(${longitude} ${latitude})')`
    );

    const graffitis = await Graffiti.findAll(
      {
        attributes: [
          "id",
          "name",
          "description",
          "artist_name",
          "created_at",
          "point",
          [
            Sequelize.fn(
              "ROUND",
              Sequelize.fn(
                "ST_Distance_Sphere",
                Sequelize.col("point"),
                location
              ),
              0
            ),
            "distance"
          ],
          "user_id"
        ],
        subQuery: false,
        where: Sequelize.where(
          Sequelize.fn("ST_Distance_Sphere", Sequelize.col("point"), location),
          { [Op.lte]: 10000 }
        ),
        order: [["created_at", "DESC"]],
        include: [
          { model: File, as: "images", attributes: ["name", "path", "url"] }
        ],
        offset: (page - 1) * 20
      }
      // order: [[distance, "DESC"]],
      // limit: 20,
    );

    return res.json(graffitis);
  }

  async indexOne(req, res) {
    const graffitis = await Graffiti.findOne({
      where: { id: req.params.id },
      order: [["created_at", "DESC"]],
      subQuery: false,
      attributes: ["id", "name", "description", "artist", "created_at"],
      include: [
        { model: File, as: "graffiti", attributes: ["name", "path", "url"] },
        { model: Like, as: "likes", attributes: [graffiti_id] }
      ]
    });

    return res.json(graffitis);
  }

  async indexByUser(req, res) {
    const { page = 1 } = req.query;

    const graffitis = await Graffiti.findAll(
      {
        attributes: [
          "id",
          "name",
          "description",
          "artist_name",
          "created_at",
          "point",
          "user_id"
        ],
        subQuery: false,
        where: { user_id: req.userId },
        order: [["created_at", "DESC"]],
        include: [
          { model: File, as: "images", attributes: ["name", "path", "url"] }
        ],
        offset: (page - 1) * 20
      }
      // order: [[distance, "DESC"]],
      // limit: 20,
    );

    return res.json(graffitis);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .required()
        .max(30)
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const location = {
      type: "Point",
      coordinates: [req.body.longitude, req.body.latitude]
    };

    const {
      id,
      name,
      description,
      user_id,
      artist_name,
      point
    } = await Graffiti.create({
      name: req.body.name,
      description: req.body.description,
      user_id: req.userId,
      artist_name: req.body.artist_name,
      point: location
    });

    const graffiti = { id, name, description, user_id, artist_name, point };

    const sendSocketMessageTo = findConnections({
      latitude: graffiti.point.coordinates[1],
      longitude: graffiti.point.coordinates[0]
    });

    sendMessage(sendSocketMessageTo, "graffiti-dev", graffiti);

    return res.json({ id, name, description, user_id, artist_name, point });
  }

  async delete(req, res) {
    const graffiti = await Graffiti.destroy({
      where: {
        id: req.params.id
      }
    });

    return res.json(graffiti);
  }
}

export default new GraffitiController();
