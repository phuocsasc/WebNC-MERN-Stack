const MyConstants = {
  DB_SERVER: 'clustermern.qw9hl.mongodb.net',
  DB_USER: 'ngocphuoc',
  DB_PASS: '123',
  DB_DATABASE: 'shoppingonline',
  JWT_SECRET: 'tranngocphuoc',
  JWT_EXPIRES: '20h', // in milliseconds (01 year = 31556952000 ms)
  EMAIL_USER: '#', //Google mail service
  EMAIL_PASS: '#',
};
console.log('JWT_EXPIRES:', MyConstants.JWT_EXPIRES);
module.exports = MyConstants;


