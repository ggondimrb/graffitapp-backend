import * as Yup from "yup";
import User from "../models/User";
import Queue from "../../lib/Queue";
import CreateMail from "../jobs/CreateMail";

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6)
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    console.log(req.body);
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: "User already exists." });
    }

    const { id, name, email, artist } = await User.create(req.body);

    // await Queue.add(CreateMail.key, {
    //   name,
    //   email
    // });

    return res.json({
      id,
      name,
      email,
      artist
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      // obrigatorio apenas se o oldPassword for informado
      password: Yup.string()
        .min(6)
        .when("oldPassword", (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when("password", (password, field) =>
        password ? field.required().oneOf([Yup.ref("password")]) : field
      )
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const { email, oldPassword } = req.body;
    console.log(req.userId);
    const user = await User.findByPk(req.userId);
    console.log(email);
    console.log(user.email);
    if (email != user.email) {
      const userExists = await User.findOne({
        where: { email }
      });

      if (userExists) {
        return res.status(400).json({ error: "User already exists." });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: "Password not match" });
    }

    const { id, name, artist } = await user.update(req.body);

    return res.json({ ok: true });
  }
}

export default new UserController();
