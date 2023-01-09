
const nodemailer = require("nodemailer");

const sendEmail = async options => {

    // creating the transporter
    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "bf6d8e8227669c",
            pass: "434ac5902e1a90"   
        }
    })

    // defining the email options
    const mailOptions = {
        from: "Avdhesh Gautam <hello@avdhesh.io>",
        to: options.email,
        subject: options.subject,       
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





































