
const nodemailer = require("nodemailer");
const pug = require('pug');

const sendEmail = async (options, req) => {

    // creating the transporter
    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "bf6d8e8227669c",  
            pass: "434ac5902e1a90"   
        }  
    })

    // sending the HTML for the email
    const resetURL = `${req.protocol}://${req.get('host')}/resetPassword/${options.resetToken}`;

    const html = pug.renderFile(`${__dirname}/../views/emailPasswordReset.pug`, {
        firstName: this.firstName,
        url: resetURL,
        subject: "Forgot Password"     
      });

    // defining the email options
    const mailOptions = {
        from: "Avdhesh Gautam <hello@avdhesh.io>",
        to: options.email,
        subject: options.subject,  
        html,
        text: options.message
    }

    // send the email
    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.log("error in the transporter",  err);
    }
}

module.exports = sendEmail;





































