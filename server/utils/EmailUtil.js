const nodemailer = require('nodemailer');
const MyConstants = require('./MyConstants');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MyConstants.EMAIL_USER,
    pass: MyConstants.EMAIL_PASS
  }
});

const EmailUtil = {
  send(email, id, token) {
    const mailOptions = {
      from: `"Your Service Name" <${MyConstants.EMAIL_USER}>`,
      to: email,
      subject: "Xác thực tài khoản của bạn",
      text: `Xin chào, \n\nBạn đã yêu cầu một mã xác thực.\n\nID: ${id}\nToken: ${token}\n\nVui lòng nhập thông tin này vào trang web để xác thực tài khoản của bạn.`,
      html: `<p>Xin chào,</p>
             <p>Bạn đã yêu cầu một mã xác thực.</p>
             <p><strong>ID:</strong> ${id}</p>
             <p><strong>Token:</strong> ${token}</p>
             <p>Vui lòng nhập thông tin này vào trang xác thực.</p>`
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("Lỗi gửi email:", err);
          reject(err);
        } else {
          console.log("✅ Email gửi thành công:", info.response);
          resolve(true);
        }
      });
    });
  }
};

module.exports = EmailUtil;
