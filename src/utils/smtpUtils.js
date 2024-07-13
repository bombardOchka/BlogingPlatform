import pug from 'pug'
import { transporter } from '../config/smpt-config.js';

async function emailConfirmMail(username, confirmationCode, email) {

    const html = pug.renderFile('./views/emailConfirm.pug', { username, confirmationCode });

    const info = await transporter.sendMail({
        from: 'JDH Company <fvvcvjfbhhf@gmail.com>', 
        to: email, 
        subject: "Confirm Your Email Address", 
        text: "", 
        html: html, 
    });

    console.log("Message sent: %s", info.messageId);
}




async function passwordResetMail(resetCode, email) {

    const html = pug.renderFile('./views/passwordReset.pug', { resetCode });

    const info = await transporter.sendMail({
        from: 'JDH Company <fvvcvjfbhhf@gmail.com>', 
        to: email, 
        subject: "Reset Password Code", 
        text: "", 
        html: html, 
    });

    console.log("Message sent: %s", info.messageId);
}

export {emailConfirmMail, passwordResetMail}