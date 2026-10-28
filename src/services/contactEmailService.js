import nodemailer from "nodemailer";

const RECIPIENT = "jayeshgondaliya9929@gmail.com";

export async function sendContactEmail({ fullName, email, number, msg }) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP configuration is missing");
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"IPO GMP Contact" <${SMTP_USER}>`,
    to: RECIPIENT,
    replyTo: email,
    subject: `Contact form message from ${fullName}`,
    text: [
      `Full name: ${fullName}`,
      `Email: ${email}`,
      `Number: ${number}`,
      "",
      "Message:",
      msg,
    ].join("\n"),
  });
}