//for sending mail to the user -->we are using nodemailer
const nodemailer = require("nodemailer");

//sending mail to the signed in user that you are successfullly logged in to our platform
const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

//Send an email when user is signup
const sendEmail = async (name, email,text) => {
  try {
    const info = await transport.sendMail({
      from: '"DevTinder" <loonaali358@gmail.com>',
      to: email,
      subject: "DevTinder Aleart ✔",
      text: `${name}, ${text}`,
    });
    console.log(info);
  } catch (error) {
    console.log(`Error while sending email is :${error.message}`);
  }
};

module.exports = { sendEmail };
