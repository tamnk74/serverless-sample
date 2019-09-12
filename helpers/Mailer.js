import request from 'request';
import nodemailer from 'nodemailer';
import config from '../config';
import { File } from './File'

export default class Mailer {
  /**
   * constructor
   */
  constructor(mailConfig = config.mailConfig) {
    this.config = mailConfig;
    this.fileHelper = new File();
  }
  /**
   * Send email using Mail Server
   * @param {Object} options contains from, to, subject, text, html
   */
  sendMail(options) {
    return new Promise((resolve, reject) =>{
      const transporter = nodemailer.createTransport(this.config);
      transporter.sendMail(options, (error, info) => {
        if (error) {
            reject(error);
        }
        resolve(info);
      });
    });
  }

  /**
   * Function send mail via api v3 sendgrid
   *
   * @param {Object} mailOptions
   * @returns {Object}
   * @memberof Helper
   */
  sendMailByApiV3({fromEmail, toEmails, subject, textContent, htmlContent, fromName = ''}) {
    const secrectKey = this.apiKey ? this.apiKey : config.mailConfig.auth.pass;
    const to = toEmails.map(email => ({email: email}));
    // Setting data send mail
    const postData = {
      personalizations: [{to: to, subject: subject}],
      from: {
        email: fromEmail,
        name: fromName
      },
      content: [{type: " text/plain", value: htmlContent != '' ? htmlContent : textContent}]
    }
    const options = {
      method: "POST",
      uri: 'https://api.sendgrid.com/v3/mail/send',
      port: 443,
      headers: {
        'User-Agent': 'request',
        'authorization': `Bearer ${secrectKey}`,
        'content-type': 'application/json'
      },
      json: postData
    }

    return new Promise((resolve, reject) => {
      // Call api post send mail
      request(options, function (error, response, body) {
        if (error) {
          return reject(new Error(`Error function sendMailByApiV3 ${error}`));
        }
        resolve({response: response.statusCode});
      });
    });
  }
  /**
   * Send feedback email
   * @param {Object} data 
   */
  async sendFeedBackMail(data) {
    const defaultFeedback = {
      department: '',
      inquiry: '',
    }
    const feedbackData = Object.assign({}, defaultFeedback, data);
    const mailTemplate = this.fileHelper.loadTemplate('feedback-mail', feedbackData);
    const mailOptions = {
      fromEmail: '"TomNk" <admin@gmail.com>',
      toEmails: ['admin@gmail.com'], // list of receivers
      subject: 'Sample mail', // Subject line
      textContent: '', // plain text body
      htmlContent: mailTemplate, // html body
      fromName: 'Hello Viet Nam'
    };
    const result = await this.sendMailByApiV3(mailOptions);
    console.log('Sending email status: ', result);
  }

}