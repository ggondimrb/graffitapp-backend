import { format, parseISO } from "date-fns";
import Mail from "../../lib/Mail";

class CreateMail {
  get key() {
    return "CreateMail";
  }

  async handle({ data }) {
    const { name, email } = data;

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: "Seja bem-vindo!",
      template: "create",
      context: {
        user: name
      }
    });
  }
}

export default new CreateMail();
