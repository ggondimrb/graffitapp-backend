import * as Yup from "yup";
import Graffiti from "../models/Graffiti";

class GraffitiController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const graffitis = await Graffiti.findAll({
      where: { user_id: req.userId },
      order: ["name"],
      attributes: ["id", "name", "description"],
      limit: 20,
      offset: (page - 1) * 20
    });

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

    const { id, name, description, user_id } = await Graffiti.create({
      name: req.body.name,
      description: req.body.description,
      user_id: req.userId
    });

    return res.json({ id, name, description, user_id });
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
