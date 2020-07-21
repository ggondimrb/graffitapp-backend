import Like from "../models/Like";
import User from "../models/User";
import Graffiti from "../models/Graffiti";

class LikeController {
  async store(req, res) {
    const { graffiti_id } = req.body;

    const user = await User.findByPk(req.userId);
    const graffiti = await Graffiti.findByPk(graffiti_id);

    const likeExists = await Like.findOne({
      where: { user_id: req.userId, graffiti_id }
    });

    if (likeExists) {
      return res.status(400).json({ error: "Like already exists." });
    }

    if (!user || !graffiti) {
      return res.status(400).json({ error: "User or Graffiti not found." });
    }

    await Like.create({ graffiti_id, user_id: req.userId });
    // if (likeExists) {
    //   const { like } = await Like.update(
    //     { like: !like },
    //     { where: { user_id: req.userId, graffiti_id } }
    //   );
    // } else {

    //}

    return res.json("Like!");
  }

  async delete(req, res) {
    await Like.destroy({
      where: {
        graffiti_id: req.params.id,
        user_id: req.userId
      }
    });

    return res.json("Dislike!");
  }

  async indexOne(req, res) {
    const { graffiti_id } = req.params;

    const graffitis = await Like.findOne({
      where: { user_id: req.userId, graffiti_id },
      attributes: ["id"]
    });

    return res.json(graffitis);
  }
}

export default new LikeController();
