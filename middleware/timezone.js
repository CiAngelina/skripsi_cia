// const moment = require('moment-timezone');

// function timezone(req, res, next) {
//   req.currentTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
//   next();
// }

// module.exports = timezone;
// middleware/timezone.js
// const moment = require('moment-timezone');

// function timezoneMiddleware(req, res, next) {
//   req.currentTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
//   req.convertToJakartaTime = (date) => moment(date).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
//   next();
// }

// module.exports = timezoneMiddleware;


const moment = require('moment-timezone');

function timezoneMiddleware(req, res, next) {
  req.currentTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
  req.convertToJakartaTime = (date) => moment(date).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

  // Fungsi untuk mengonversi createdAt dan updatedAt
  req.convertTimestamps = (item) => {
    if (item) {
      if (item.createdAt) {
        item.createdAt = req.convertToJakartaTime(item.createdAt);
      }
      if (item.updatedAt) {
        item.updatedAt = req.convertToJakartaTime(item.updatedAt);
      }
    }
    return item;
  };

  next();
}

module.exports = timezoneMiddleware;
