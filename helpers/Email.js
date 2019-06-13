import nodemailer from "nodemailer";

export default class Email {
  static async sendEmail(data) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 465,
      secure: true,
      auth: {
        user: 'tamnk',
        pass: 'Tam102120254'
      },
      logger: false,
      debug: false
    });

    // Message content
    const message = {
      from: 'tamnk@rikkeisoft.com',
      // Comma separated list of recipients
      to: data.receiver,
      // Subject of the message
      subject: data.subject,
      // Body
      html: data.content
    };
    console.log('Mail message:', message);
    const result = await transporter.sendMail(message);
    return result;
  }
}