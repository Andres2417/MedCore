const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.sendMail({
  from: process.env.SMTP_USER,
  to: process.env.SMTP_USER,
  subject: "Prueba de correo",
  text: "Si esto llega, tus credenciales funcionan",
}).then(() => console.log("Correo enviado"))
  .catch(err => console.error("Error:", err));
