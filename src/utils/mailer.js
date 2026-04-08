import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (to, OTP) => {
  try {
    await transport.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "OTP for sign up for BookHub",
      text: `Your OTP is ${OTP}`,
    });
  } catch (error) {
    console.error("OTP not sent:", error);
  }
};

const sendResetEmail = async (to, resetUrl) => {
  try {
    await transport.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "OTP for sign up for BookHub",
      html: `<a href="${resetUrl}">Reset Password</a>`,

    });
  } catch (error) {
    console.error("OTP not sent:", error);
  }
};

export { sendEmail, sendResetEmail };
