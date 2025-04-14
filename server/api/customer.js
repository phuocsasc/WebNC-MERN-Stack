const express = require('express');
const router = express.Router();
// utils
const CryptoUtil = require('../utils/CryptoUtil');
const EmailUtil = require('../utils/EmailUtil');
const JwtUtil = require('../utils/JwtUtil');
const EmailResetPassUtil = require("../utils/EmailResetPassUtil");
// daos
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const CustomerDAO = require('../models/CustomerDAO');
const OrderDAO = require('../models/OrderDAO');
// category
router.get('/categories', async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});
// product
router.get('/products/new', async function (req, res) {
  const products = await ProductDAO.selectTopNew(3);
  res.json(products);
});
router.get('/products/hot', async function (req, res) {
  const products = await ProductDAO.selectTopHot(3);
  res.json(products);
});
router.get('/products/category/:cid', async function (req, res) {
  const _cid = req.params.cid;
  const products = await ProductDAO.selectByCatID(_cid);
  res.json(products);
});
router.get('/products/search/:keyword', async function (req, res) {
  const keyword = req.params.keyword;
  const products = await ProductDAO.selectByKeyword(keyword);
  res.json(products);
});
router.get('/products/:id', async function (req, res) {
  const _id = req.params.id;
  const product = await ProductDAO.selectByID(_id);
  res.json(product);
});
// customer
router.post('/signup', async function (req, res) {
  const { username, password, name, phone, address, email } = req.body;

  try {
    const dbCust = await CustomerDAO.selectByUsernameOrEmail(username, email);
    if (dbCust) {
      return res.json({ success: false, message: 'Exists username or email' });
    }

    const now = new Date().getTime(); // milliseconds
    const token = CryptoUtil.md5(now.toString());

    // Thêm resetToken và tokenExpiry vào newCust
    const newCust = {
      username,
      password,
      name,
      phone,
      address,
      email,
      active: 0,
      token,
      resetToken: null,  // Giá trị mặc định là null
      tokenExpiry: null  // Giá trị mặc định là null
    };

    const result = await CustomerDAO.insert(newCust);
    if (result) {
      const send = await EmailUtil.send(email, result._id, token);
      if (send) {
        res.json({ success: true, message: 'Please check email' });
      } else {
        res.json({ success: false, message: 'Email failure' });
      }
    } else {
      res.json({ success: false, message: 'Insert failure' });
    }
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
router.post('/active', async function (req, res) {
  const _id = req.body.id;
  const token = req.body.token;
  const result = await CustomerDAO.active(_id, token, 1);
  res.json(result);
});
router.post('/login', async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    const customer = await CustomerDAO.selectByUsernameAndPassword(username, password);
    if (customer) {
      if (customer.active === 1) {
        const token = JwtUtil.genToken();
        res.json({ success: true, message: 'Authentication successful', token: token, customer: customer });
      } else {
        res.json({ success: false, message: 'Account is deactive' });
      }
    } else {
      res.json({ success: false, message: 'Incorrect username or password' });
    }
  } else {
    res.json({ success: false, message: 'Please input username and password' });
  }
});
router.get('/token', JwtUtil.checkToken, function (req, res) {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  res.json({ success: true, message: 'Token is valid', token: token });
});
// myprofile
router.put('/customers/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const phone = req.body.phone;
  const address = req.body.address;
  const email = req.body.email;
  const customer = { _id: _id, username: username, password: password, name: name, phone: phone, address: address, email: email };
  const result = await CustomerDAO.update(customer);
  res.json(result);
});
// mycart
router.post('/checkout', JwtUtil.checkToken, async function (req, res) {
  const now = new Date().getTime(); // milliseconds
  const total = req.body.total;
  const items = req.body.items;
  const customer = req.body.customer;
  const order = { cdate: now, total: total, status: 'PENDING', customer: customer, items: items };
  const result = await OrderDAO.insert(order);
  res.json(result);
});
// myorders
router.get('/orders/customer/:cid', JwtUtil.checkToken, async function (req, res) {
  const _cid = req.params.cid;
  const orders = await OrderDAO.selectByCustID(_cid);
  res.json(orders);
});
/// Quên mật khẩu: Gửi email chứa link reset mật khẩu
router.post('/forgotpassword', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email không được để trống!" });
  }

  try {
    // 🔍 Kiểm tra email có tồn tại không
    const user = await CustomerDAO.selectByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "Email không tồn tại trong hệ thống!" });
    }

    // 🔑 Tạo token đặt lại mật khẩu
    await CustomerDAO.createPasswordResetToken(email);

    // 🔄 Lấy lại token sau khi đã cập nhật trong DB
    const resetToken = await CustomerDAO.selectResetToken(email);
    if (!resetToken) {
      return res.status(500).json({ error: "Không thể lấy token, vui lòng thử lại!" });
    }

    // 📨 Gửi email với đường link reset
    const resetLink = `https://customer-frontend-ilj2.onrender.com/reset-password/${resetToken}`;
    await EmailResetPassUtil.send(email, resetLink);

    return res.json({
      message: "Vui lòng kiểm tra email để đặt lại mật khẩu!",
      token: resetToken,
    });
  } catch (err) {
    console.error("❌ Lỗi khi gửi yêu cầu reset mật khẩu:", err);
    return res.status(500).json({ error: "Lỗi hệ thống, vui lòng thử lại!" });
  }
});
// Đặt lại mật khẩu: Xác minh token & cập nhật mật khẩu mới
router.post("/reset-password", async (req, res) => {
  console.log("🔹 Dữ liệu nhận được từ client:", req.body); // 🛠 Debug

  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ error: "Thiếu token hoặc mật khẩu mới! customer" });
  }

  try {
    const user = await CustomerDAO.resetPassword(token, newPassword);
    if (!user) {
      return res.status(400).json({ error: "Token không hợp lệ hoặc đã hết hạn! customer" });
    }

    return res.json({ message: "Mật khẩu đã được cập nhật thành công! customer" });
  } catch (error) {
    console.error("Lỗi khi đặt lại mật khẩu:", error);
    return res.status(500).json({ error: "Lỗi máy chủ!" });
  }
});
module.exports = router;