import nodemailer from 'nodemailer';
import config from '../config/index';

export default nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.mail.user,
    pass: config.mail.password,
  },
});
