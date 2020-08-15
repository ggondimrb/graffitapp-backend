import Comment from "../models/Comment";
import User from "../models/User";
import Graffiti from "../models/Graffiti";

class CommentController {
  async store(req, res) {
    const { graffiti_id, comment } = req.body;

    const user = await User.findByPk(req.userId);
    const graffiti = await Graffiti.findByPk(graffiti_id);

    if (!user || !graffiti) {
      return res.status(400).json({ error: "User or Graffiti not found." });
    }

    const { id } = await Comment.create({
      comment,
      graffiti_id,
      user_id: req.userId
    });

    const commentRes = await Comment.findByPk(id, {
      include: [{ model: User, as: "user", attributes: ["id", "name"] }]
    });

    return res.json(commentRes);
  }

  async delete(req, res) {
    await Comment.destroy({
      where: {
        id: req.params.id,
        user_id: req.userId
      }
    });

    return res.json("Remove!");
  }

  async index(req, res) {
    const { graffiti_id } = req.params;

    const comments = await Comment.findAll({
      where: { graffiti_id },
      attributes: ["id", "comment", "created_at"],
      order: [["created_at", "DESC"]],
      include: [{ model: User, as: "user", attributes: ["id", "name"] }]
    });

    return res.json(comments);
  }
}

export default new CommentController();
