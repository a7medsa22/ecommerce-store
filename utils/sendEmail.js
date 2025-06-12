const nodemailer = require("nodemailer");
const sendEmail = (option) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true, // true for 465, false 587 for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const multioption = {
      from: "Sotohy-Amazon App <abostohy123@gmail.com>",
      to: option.email,
      subject: option.subject,
      text: option.massage,
    };
    transporter.sendMail(multioption);
};
module.exports = sendEmail;