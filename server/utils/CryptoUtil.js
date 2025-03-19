//CLI: npm install crypto --save
const crypto = require('crypto');

const CryptoUtil = {
  md5(input) {
    return crypto.createHash('md5').update(input).digest('hex');
  },
  randomBytes(size) {
    return crypto.randomBytes(size).toString('hex');
  }
};

module.exports = CryptoUtil;
