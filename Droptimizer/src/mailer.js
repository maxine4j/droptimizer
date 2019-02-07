const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    }
})

console.log('Mailer set up with user:', process.env.GMAIL_USER);

function sendMail(subject, body) {
    const opts = {
        from: process.env.GMAIL_USER,
        to: process.env.ERROR_EMAIL_TARGET,
        subject: `Bastion Droptimier: ${subject}`,
        text: body
    };

    transporter.sendMail(opts, function(error, info){
        if (error) {
            console.error(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function error(err) {
    sendMail('Error', err.stack);
}

function log(s) {
    sendMail('Info', s);
}

module.exports = {
    'error': error,
    'log': log
};
