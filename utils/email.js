const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "rivki4862@gmail.com",
        pass: "fobe reqr wfmm yygc"
    }
});

async function sendCongratsEmail(toEmail, name) {
    await transporter.sendMail({
        from: '"Your System" <rivki4862@gmail.com>',
        to: toEmail,
        subject: "כל הכבוד!",
        text: `שלום ${name},\n\nכל הכבוד!`,
    });
}

module.exports = { sendCongratsEmail };
