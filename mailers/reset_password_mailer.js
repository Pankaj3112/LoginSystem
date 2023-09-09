const nodemailer = require('../config/nodemailer');


module.exports.newResetPassword = (token) => {
    nodemailer.transporter.sendMail({
        from: 'pankajbeniwal3112@gmail.com',
        to: token.user.email,
        subject: "Reset Password Link",
        html: `<h1>Hi ${token.user.name}<h1>
               <h1>Click on this link to reset your password</h1> 
               <p>http://localhost:8000/users/reset-password/?token=${token.accessToken}</p>`
    }, 
    (err, info) => {
        if (err) {
            console.log('Error in sending mail', err);
            return;
        }
        console.log('Message sent', info);
        return;
    });
}