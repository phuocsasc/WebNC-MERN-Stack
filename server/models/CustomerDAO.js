require('../utils/MongooseUtil');
const Models = require('./Models');
const CryptoUtil = require('../utils/CryptoUtil');

const CustomerDAO = {
  async selectByUsernameOrEmail(username, email) {
    const query = { $or: [{ username: username }, { email: email }] };
    const customer = await Models.Customer.findOne(query);
    return customer;
  },
  async insert(customer) {
    const mongoose = require('mongoose');
    customer._id = new mongoose.Types.ObjectId();
    const result = await Models.Customer.create(customer);
    return result;
  },
  async active(_id, token, active) {
    const query = { _id: _id, token: token };
    const newvalues = { active: active };
    const result = await Models.Customer.findOneAndUpdate(query, newvalues, { new: true });
    return result;
  },
  async selectByUsernameAndPassword(username, password) {
    const query = { username: username, password: password };
    const customer = await Models.Customer.findOne(query);
    return customer;
  },
  async update(customer) {
    const newvalues = { username: customer.username, password: customer.password, name: customer.name, phone: customer.phone, address: customer.address, email: customer.email };
    const result = await Models.Customer.findByIdAndUpdate(customer._id, newvalues, { new: true });
    return result;
  },
  async selectAll() {
    const query = {};
    const customers = await Models.Customer.find(query).exec();
    return customers;
  },
  async selectByID(_id) {
    const customer = await Models.Customer.findById(_id).exec();
    return customer;
  },

  // 🆕 Thêm phương thức selectByEmail
  async selectByEmail(email) {
    const customer = await Models.Customer.findOne({ email: email }).exec();
    return customer;
  },


  // 🆕 Tạo token đặt lại mật khẩu (token sẽ hết hạn sau 1 giờ)
  async createPasswordResetToken(email) {
    const customer = await this.selectByEmail(email);
    if (!customer) return null;

    const resetToken = CryptoUtil.randomBytes(32);
    const hashedToken = CryptoUtil.md5(resetToken);
    const expiryTime = Date.now() + 300000; // 5 phút

    // Cập nhật trực tiếp vào database
    const updatedCustomer = await Models.Customer.findOneAndUpdate(
      { email: email },
      {
        resetToken: hashedToken,
        tokenExpiry: expiryTime
      },
      { new: true }
    );

    if (!updatedCustomer) return null;
    return resetToken;
  },


  // 🆕 Xác thực token và cập nhật mật khẩu mới
  async resetPassword(token, newPassword) {
    if (!token) {
      console.error("⚠️ Token không hợp lệ hoặc bị thiếu!");
      return null;
    }

    // Mã hóa token để so sánh với token trong DB
    // const hashedToken = CryptoUtil.md5(token);

    const customer = await Models.Customer.findOne({
      resetToken: token,
      tokenExpiry: { $gt: Date.now() }, // Kiểm tra token có còn hạn không
    }).exec();

    if (!customer) {
      console.error("⚠️ Không tìm thấy người dùng với token này!");
      return null;
    }

    // ✅ Cập nhật mật khẩu mới
    customer.password = newPassword;
    customer.resetToken = undefined;
    customer.tokenExpiry = undefined;

    await customer.save();
    return customer;
  },

  // 🆕 Lấy resetToken từ database dựa vào email
  async selectResetToken(email) {
    const customer = await Models.Customer.findOne(
      { email: email },
      { resetToken: 1, tokenExpiry: 1 } // Chỉ lấy 2 trường cần thiết
    ).exec();

    if (!customer || !customer.resetToken) {
      console.error("⚠️ Không tìm thấy resetToken hoặc token không tồn tại!");
      return null;
    }
    return customer.resetToken; // Trả về resetToken
  }





};
module.exports = CustomerDAO;