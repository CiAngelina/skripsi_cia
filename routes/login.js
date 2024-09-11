// const express = require('express');
// const router = express.Router();
// const jwt = require('jsonwebtoken');
// const { Admin, Teknisi } = require('../models');
// const Validator = require('fastest-validator');
// const v = new Validator();
// const { Sequelize } = require('sequelize');
// // const timezoneMiddleware = require('../middleware/timezone');
// const { timezoneMiddleware} = require('../middleware'); // Impor middleware CORS dari index.js

// // Gunakan middleware CORS
// // router.use(corsMiddleware);


// // Middleware untuk pengaturan timezone
// router.use(timezoneMiddleware);

// router.post('/', async (req, res) => {
//   const schema = {
//     username: { type: "string", empty: false },
//     pass: { type: "string", empty: false }
//   };

//   const validate = v.validate(req.body, schema);
//   if (validate.length) {
//     return res.status(400).json(validate);
//   }

//   try {
//     const { username, pass } = req.body;

//     // Cek apakah username ada di database Teknisi dengan case-sensitive
//     let user = await Teknisi.findOne({
//       where: Sequelize.where(Sequelize.fn('BINARY', Sequelize.col('username')), username)
//     });

//     let table = 'Teknisi';

//     if (!user) {
//       // Jika username tidak ditemukan di Teknisi, cek di Admin dengan case-sensitive
//       user = await Admin.findOne({
//         where: Sequelize.where(Sequelize.fn('BINARY', Sequelize.col('username')), username)
//       });

//       table = 'Admin'; // Set table to 'Admin' if user found in Admin table

//       if (!user) {
//         return res.status(401).json({ message: 'Username Anda salah' });
//       }
//     }

//     // Periksa apakah password sesuai
//     if (user.pass !== pass) {
//       return res.status(401).json({ message: 'Password Anda salah' });
//     }

//     // Jika username dan password sesuai, buat token JWT
//     const userData = user.toJSON();
//     const token = jwt.sign(
//       { id: userData.id, username: userData.username, table }, // Tambahkan tabel pengguna
//       'your_secret_key', 
//       { expiresIn: '24h' }
//     );

//     // Kirim token JWT bersama dengan data pengguna
//     const result = req.convertTimestamps(userData);
//     return res.json({ message: 'Login berhasil', token, ...result });
//   } catch (error) {
//     console.error('Error during login:', error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Admin, Teknisi } = require('../models');
const Validator = require('fastest-validator');
const { timezoneMiddleware } = require('../middleware');
const { Sequelize } = require('sequelize');

const v = new Validator();

// Middleware untuk pengaturan timezone
router.use(timezoneMiddleware);

router.post('/', async (req, res) => {
  // Validasi input
  const schema = {
    username: { type: "string", empty: false },
    pass: { type: "string", empty: false }
  };

  const validationErrors = v.validate(req.body, schema);
  if (validationErrors.length) {
    return res.status(400).json(validationErrors);
  }

  try {
    const { username, pass } = req.body;

    // Cek apakah username ada di database Teknisi dengan case-sensitive
    let user = await Teknisi.findOne({
      where: Sequelize.where(Sequelize.fn('BINARY', Sequelize.col('username')), username)
    });

    let table = 'Teknisi';

    if (!user) {
      // Jika username tidak ditemukan di Teknisi, cek di Admin dengan case-sensitive
      user = await Admin.findOne({
        where: Sequelize.where(Sequelize.fn('BINARY', Sequelize.col('username')), username)
      });

      table = 'Admin'; // Set table to 'Admin' if user found in Admin table

      if (!user) {
        return res.status(401).json({ message: 'Username Anda salah' });
      }
    }

    // Periksa apakah password sesuai
    if (user.pass !== pass) {
      return res.status(401).json({ message: 'Password Anda salah' });
    }

    // Jika username dan password sesuai, buat token JWT
    const userData = user.toJSON();
    const token = jwt.sign(
      { id: userData.id, username: userData.username, table }, // Tambahkan tabel pengguna
      'your_secret_key', 
      { expiresIn: '24h' }
    );

    // Kirim token JWT bersama dengan data pengguna
    const result = req.convertTimestamps(userData);
    return res.json({ message: 'Login berhasil', token, ...result });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
