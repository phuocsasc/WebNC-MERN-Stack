const nodemailer = require('nodemailer');
const MyConstants = require('./MyConstants');

const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
            user: MyConstants.EMAIL_USER,
            pass: MyConstants.EMAIL_PASS
      }
});

const EmailResetPassUtil = {
      send(email, resetLink) {
            const mailOptions = {
                  from: `"Support Team" <${MyConstants.EMAIL_USER}>`,
                  to: email,
                  subject: "Đặt lại mật khẩu của bạn",
                  text: `Bạn đã yêu cầu đặt lại mật khẩu. Nhấn vào link bên dưới để đặt lại:\n\n${resetLink}\n\nNếu bạn không yêu cầu, hãy bỏ qua email này.`,
                  html: `<p>Bạn đã yêu cầu đặt lại mật khẩu.</p>
                   <p><a href="${resetLink}">Nhấn vào đây</a> để đặt lại.</p>
                   <p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>`
            };

            return new Promise((resolve, reject) => {
                  transporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                              console.error("❌ Gửi email thất bại:", err);
                              reject(err);
                        } else {
                              console.log("✅ Email gửi thành công:", info.response);
                              resolve(true);
                        }
                  });
            });
      }
};

module.exports = EmailResetPassUtil;
