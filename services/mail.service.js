const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

// This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_API_DOMAIN
  }
}

const nodemailerMailgun = nodemailer.createTransport(mg(auth));

// point to the template folder
const handlebarOptions = {
  viewEngine: {
    partialsDir: path.resolve('./views/'),
    defaultLayout: false,
  },
  viewPath: path.resolve('./views/'),
};

// use a template file with nodemailer
nodemailerMailgun.use('compile', hbs(handlebarOptions))

exports.sendEmail = async (mailOptions) => {
  console.log(mailOptions)
  nodemailerMailgun.sendMail({
    from: process.env.MAILGUN_EMAIL,
    to: mailOptions.toEmail, // An array if you have multiple recipients.
    subject: mailOptions.subject,
    template: mailOptions.template,
    context: mailOptions.context
  }, (err, info) => {
    if (err) {
      console.log(err)
      return err;
    }
    else {
      console.log(info)
      return info;
    }
  });
};