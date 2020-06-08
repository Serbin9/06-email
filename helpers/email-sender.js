const sgMail = require("@sendgrid/mail");
require("dotenv").config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendEmail = async (msg) => await sgMail.send(msg);
