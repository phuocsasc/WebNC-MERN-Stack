//CLI: npm install express body-parser --save
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors({
  origin: [
    'https://admin-frontend-pb44.onrender.com',
    'https://customer-frontend-ilj2.onrender.com'
  ],                                                // hoặc '*' trong giai đoạn test
  credentials: true
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
// middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
// apis
app.get('/hello', (req, res) => { res.json({ message: 'Hello from server!' }); });
app.use('/api/admin', require('./api/admin'));
app.use('/api/customer', require('./api/customer'));

// deployment
const path = require('path');
// '/admin' serve the files at client-admin/build/* as static files
app.use('/admin', express.static(path.resolve(__dirname, '../client-admin/build')));
app.get('admin/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client-admin/build', 'index.html'))
});
// '/' serve the files at client-customer/build/* as static files
app.use('/', express.static(path.resolve(__dirname, '../client-customer/build')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client-customer/build', 'index.html'));
});