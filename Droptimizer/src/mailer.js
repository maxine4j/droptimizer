const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    }
})

console.log('Mailer set up with user:', process.env.GMAIL_USER);

function error(err) {
    const opts = {
        from: process.env.GMAIL_USER,
        to: process.env.ERROR_EMAIL_TARGET,
        subject: 'Bastion Droptimier: Error',
        text: err
    };

    transporter.sendMail(opts, function(error, info){
        if (error) {
            console.error(error);
        } else {
            console.log('Error email sent: ' + info.response);
        }
    });
      
}

module.exports = {
    'error': error
};
