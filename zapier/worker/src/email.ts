import nodemailer from "nodemailer"

const transport = nodemailer.createTransport({
    host: "smtp.freesmtpservers.com",
    port:  25,
    secure:false,
})

export async function sendEmail(to:string , body : string) {
        await transport.sendMail({
            from:"pranavhole050610@gmail.com",
            sender:"",
            to,
            subject:body,
            text:body
        })    
}