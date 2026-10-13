const nodemailer = require("nodemailer");

const sendMail = async (to, sub, body)=> {
    
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
        

    try{

        const info = await transporter.sendMail({
            from: {
                name: "Shopnest",
                address: process.env.EMAIL_USER
            },
            to:to,
            subject: sub,
            text: body
        });

        console.log("Email sent successfully!");
        console.log("Message ID:", info.messageId);
    return info;
    }   catch(err) {

        console.log("Failed to send mail");
        console.log("Error : ", err.message);
    throw err;
    }
}

module.exports = sendMail;