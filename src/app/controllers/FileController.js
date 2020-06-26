import File from "../models/File";

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
      graffiti_id: req.params.id
    });

    //await User.update({ avatar_id: file.id }, { where: { id: req.userId } });

    return res.json(file);
  }
}

export default new FileController();
