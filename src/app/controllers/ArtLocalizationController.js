import ArtLocalization from "../schemas/ArtLocalization";
import Graffiti from "../models/Graffiti";
import File from "../models/File";

class ArtLocalizationController {
  async index(req, res) {
    const { latitude, longitude } = req.query;

    const artsLocalization = await ArtLocalization.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          $maxDistance: 10000
        }
      }
    });

    const arts = [];

    artsLocalization.forEach(item => {
      arts.push(item.art);
    });

    console.log(arts);

    const graffitis = await Graffiti.findAll({
      where: { id: arts },
      order: [["created_at", "DESC"]],
      subQuery: false,
      attributes: ["id", "name", "description", "artist", "created_at"],
      include: [
        { model: File, as: "graffiti", attributes: ["name", "path", "url"] }
      ]
    });

    console.log(graffitis);

    return res.json({ artsLocalization });
  }
}

export default new ArtLocalizationController();
