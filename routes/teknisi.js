// const express = require('express');
// const router = express.Router();
// const Validator = require('fastest-validator');
// const { Teknisi } = require('../models');
// const { Op } = require('sequelize');
// const v = new Validator();
// // const timezoneMiddleware = require('../middleware/timezone');
// // const authMiddleware = require('../middleware/authMiddleware');
// const { timezoneMiddleware, authMiddleware } = require('../middleware'); 

// // Gunakan middleware CORS
// // router.use(corsMiddleware);


// // Middleware untuk pengaturan timezone
// router.use(timezoneMiddleware);

// // Middleware untuk memastikan akses berdasarkan peran
// router.use(authMiddleware({ allowAdmin: true, allowTeknisi: true }));

// // Middleware untuk membatasi operasi berdasarkan peran
// const adminOnlyMiddleware = authMiddleware({ allowAdmin: true, allowTeknisi: false});

// // Untuk melihat data
// router.get('/', async (req, res) => {
//   try {
//     const daftarTeknisi = await Teknisi.findAll();
//     const hasil = daftarTeknisi.map(teknisi => req.convertTimestamps(teknisi.toJSON()));
//     return res.json(hasil);
//   } catch (error) {
//     return res.status(500).json({ message: 'Terjadi Kesalahan Internal', error: error.message });
//   }
// });

// // Untuk melihat data berdasarkan ID
// router.get('/:idteknisi', async (req, res) => {
//   try {
//     const idTeknisi = req.params.idteknisi;
//     const teknisi = await Teknisi.findByPk(idTeknisi);
//     if (!teknisi) {
//       return res.status(404).json({ message: 'Data Tidak Ditemukan' });
//     }
//     const hasil = req.convertTimestamps(teknisi.toJSON());
//     return res.json(hasil);
//   } catch (error) {
//     return res.status(500).json({ message: 'Terjadi Kesalahan Internal', error: error.message });
//   }
// });

// // Untuk menambah data (hanya untuk admin)
// // router.post('/', adminOnlyMiddleware, async (req, res) => {
// //   const schema = {
// //     nama: { type: "string", empty: false },
// //     sektor: { type: "string", empty: false },
// //     username: { type: "string", empty: false },
// //     pass: { type: "string", empty: false }
// //   };

// //   const validasi = v.validate(req.body, schema);

// //   if (validasi.length) {
// //     return res.status(400).json(validasi);
// //   }

// //   try {
// //     const teknisi = await Teknisi.create(req.body);
// //     const hasil = req.convertTimestamps(teknisi.toJSON());
// //     return res.json(hasil);
// //   } catch (error) {
// //     return res.status(500).json({ message: 'Terjadi Kesalahan Internal', error: error.message });
// //   }
// // });

// router.post('/', adminOnlyMiddleware, async (req, res) => {
//   const schema = {
//     nama: { type: "string", empty: false },
//     sektor: { type: "string", empty: false },
//     ket: { type: "string", empty: false },
//     username: { type: "string", empty: false },
//     pass: { type: "string", empty: false }
//   };

//   const validasi = v.validate(req.body, schema);

//   if (validasi.length) {
//     return res.status(400).json(validasi);
//   }

//   try {
//     // Periksa apakah nama atau username sudah ada di database
//     const existingTeknisi = await Teknisi.findOne({
//       where: {
//         [Op.or]: [
//           { nama: req.body.nama },
//           { username: req.body.username }
//         ]
//       }
//     });

//     if (existingTeknisi) {
//       return res.status(405).json({ message: 'Nama atau username sudah digunakan' });
//     }

//     const teknisi = await Teknisi.create(req.body);
//     const hasil = req.convertTimestamps(teknisi.toJSON());
//     return res.json(hasil);
//   } catch (error) {
//     return res.status(500).json({ message: 'Terjadi Kesalahan Internal', error: error.message });
//   }
// });

// // // Untuk mengedit data (untuk admin dan teknisi)
// // router.put('/:idteknisi', async (req, res) => {
// //   const idTeknisi = req.params.idteknisi;
// //   let teknisi = await Teknisi.findByPk(idTeknisi);

// //   if (!teknisi) {
// //     return res.status(404).json({ message: 'Data Tidak Ada' });
// //   }

// //   const schema = {
// //     nama: 'string|optional',
// //     sektor: 'string|optional',
// //     username: 'string|optional',
// //     pass: 'string|optional'
// //   };

// //   const validasi = v.validate(req.body, schema);

// //   if (validasi.length) {
// //     return res.status(400).json(validasi);
// //   }

// //   try {
// //     teknisi = await teknisi.update(req.body);
// //     const hasil = req.convertTimestamps(teknisi.toJSON());
// //     return res.json(hasil);
// //   } catch (error) {
// //     return res.status(500).json({ message: 'Terjadi Kesalahan Internal', error: error.message });
// //   }
// // });
// // router.put('/:idteknisi', async (req, res) => {
// //   const idTeknisi = req.params.idteknisi;
// //   let teknisi = await Teknisi.findByPk(idTeknisi);

// //   if (!teknisi) {
// //     return res.status(404).json({ message: 'Data Tidak Ada' });
// //   }

// //   const schema = {
// //     nama: { type: "string|optional", empty: false },
// //     sektor: { type: "string|optional", empty: false },
// //     username: { type: "string|optional", empty: false },
// //     pass: { type: "string|optional", empty: false }
// //   };

// //   const validasi = v.validate(req.body, schema);

// //   if (validasi.length) {
// //     return res.status(400).json(validasi);
// //   }

// //   try {
// //     // Cek apakah nama atau username yang ingin diubah sudah ada di database dan bukan milik teknisi yang sedang diubah
// //     if (req.body.nama || req.body.username) {
// //       const existingTeknisi = await Teknisi.findOne({
// //         where: {
// //           [Op.or]: [
// //             { nama: req.body.nama },
// //             { username: req.body.username }
// //           ],
// //           idteknisi: { [Op.ne]: idTeknisi }
// //         }
// //       });

// //       if (existingTeknisi) {
// //         return res.status(405).json({ message: 'Nama atau username sudah digunakan' });
// //       }
// //     }

// //     teknisi = await teknisi.update(req.body);
// //     const hasil = req.convertTimestamps(teknisi.toJSON());
// //     return res.json(hasil);
// //   } catch (error) {
// //     return res.status(500).json({ message: 'Terjadi Kesalahan Internal', error: error.message });
// //   }
// // });
// router.put('/:idteknisi', async (req, res) => {
//   const idTeknisi = req.params.idteknisi;
//   let teknisi = await Teknisi.findByPk(idTeknisi);

//   if (!teknisi) {
//     return res.status(404).json({ message: 'Data Tidak Ada' });
//   }

//   // Pastikan bahwa setidaknya ada satu field yang akan diupdate
//   if (!req.body.nama && !req.body.sektor && !req.body.username && !req.body.pass) {
//     return res.status(407).json({ message: 'Tidak ada data yang diberikan untuk diperbarui' });
//   }

//   const schema = {
//     nama: { type: "string|optional", empty: false, min: 1 },
//     sektor: { type: "string|optional", empty: false, min: 1},
//     ket: { type: "string|optional", empty: false, min: 1},
//     username: { type: "string|optional", empty: false, min: 1},
//     pass: { type: "string|optional", empty: false, min: 1 }
//   };

//   const validasi = v.validate(req.body, schema);

//   if (validasi.length) {
//     return res.status(400).json(validasi);
//   }

//   try {
//     // Cek apakah nama atau username yang ingin diubah sudah ada di database dan bukan milik teknisi yang sedang diubah
//     if (req.body.nama || req.body.username) {
//       const existingTeknisi = await Teknisi.findOne({
//         where: {
//           [Op.or]: [
//             { nama: req.body.nama },
//             { username: req.body.username }
//           ],
//           idteknisi: { [Op.ne]: idTeknisi }
//         }
//       });

//       if (existingTeknisi) {
//         return res.status(405).json({ message: 'Nama atau username sudah digunakan' });
//       }
//     }

//     teknisi = await teknisi.update(req.body);
//     const hasil = req.convertTimestamps(teknisi.toJSON());
//     return res.json(hasil);
//   } catch (error) {
//     return res.status(500).json({ message: 'Terjadi Kesalahan Internal', error: error.message });
//   }
// });

// // Untuk menghapus data (hanya untuk admin)
// router.delete('/:idteknisi', adminOnlyMiddleware, async (req, res) => {
//   try {
//     const idTeknisi = req.params.idteknisi;
//     const teknisi = await Teknisi.findByPk(idTeknisi);

//     if (!teknisi) {
//       return res.status(404).json({ message: 'Data Tidak Ditemukan' });
//     }

//     await teknisi.destroy();
//     return res.json({
//       time:  req.currentTime, 
//       message: 'Data telah dihapus'
//     });
//   } catch (error) {
//     return res.status(500).json({ message: 'Terjadi Kesalahan Internal', error: error.message });
//   }
// });

// module.exports = router;

// BARU
const express = require('express');
const router = express.Router();
const Validator = require('fastest-validator');
const { Teknisi } = require('../models');
const { Op } = require('sequelize');
const { timezoneMiddleware, authMiddleware } = require('../middleware');
const v = new Validator();

// Middleware untuk pengaturan timezone dan autentikasi
router.use(timezoneMiddleware);
router.use(authMiddleware({ allowAdmin: true, allowTeknisi: true }));

// Middleware untuk memastikan akses berdasarkan peran admin
const adminOnlyMiddleware = authMiddleware({ allowAdmin: true, allowTeknisi: false });

// Rute GET untuk melihat semua data teknisi
router.get('/', async (req, res) => {
  try {
    const daftarTeknisi = await Teknisi.findAll();
    const hasil = daftarTeknisi.map(teknisi => req.convertTimestamps(teknisi.toJSON()));
    return res.json(hasil);
  } catch (error) {
    return res.status(500).json({ message: 'Terjadi Kesalahan Internal', error: error.message });
  }
});

// Rute GET untuk melihat data teknisi berdasarkan ID
router.get('/:idteknisi', async (req, res) => {
  try {
    const idTeknisi = req.params.idteknisi;
    const teknisi = await Teknisi.findByPk(idTeknisi);
    if (!teknisi) {
      return res.status(404).json({ message: 'Data Tidak Ditemukan' });
    }
    const hasil = req.convertTimestamps(teknisi.toJSON());
    return res.json(hasil);
  } catch (error) {
    return res.status(500).json({ message: 'Terjadi Kesalahan Internal', error: error.message });
  }
});

// Rute POST untuk menambah data teknisi (hanya untuk admin)
router.post('/', adminOnlyMiddleware, async (req, res) => {
  const schema = {
    nama: { type: "string", empty: false },
    sektor: { type: "string", empty: false },
    ket: { type: "string", empty: false },
    username: { type: "string", empty: false },
    pass: { type: "string", empty: false }
  };

  const validasi = v.validate(req.body, schema);

  if (validasi.length) {
    return res.status(400).json(validasi);
  }

  try {
    // Periksa apakah nama atau username sudah ada di database
    const existingTeknisi = await Teknisi.findOne({
      where: {
        [Op.or]: [
          { nama: req.body.nama },
          { username: req.body.username }
        ]
      }
    });

    if (existingTeknisi) {
      return res.status(405).json({ message: 'Nama atau username sudah digunakan' });
    }

    const teknisi = await Teknisi.create(req.body);
    const hasil = req.convertTimestamps(teknisi.toJSON());
    return res.json(hasil);
  } catch (error) {
    return res.status(500).json({ message: 'Terjadi Kesalahan Internal', error: error.message });
  }
});

// Rute PUT untuk mengedit data teknisi berdasarkan ID
router.put('/:idteknisi', async (req, res) => {
  const idTeknisi = req.params.idteknisi;
  let teknisi = await Teknisi.findByPk(idTeknisi);

  if (!teknisi) {
    return res.status(404).json({ message: 'Data Tidak Ada' });
  }

  // Pastikan setidaknya ada satu field yang akan diupdate
  if (!req.body.nama && !req.body.sektor && !req.body.username && !req.body.pass) {
    return res.status(407).json({ message: 'Tidak ada data yang diberikan untuk diperbarui' });
  }

  const schema = {
    nama: { type: "string", optional: true, empty: false, min: 1 },
    sektor: { type: "string", optional: true, empty: false, min: 1 },
    ket: { type: "string", optional: true, empty: false, min: 1 },
    username: { type: "string", optional: true, empty: false, min: 1 },
    pass: { type: "string", optional: true, empty: false, min: 1 }
  };
  
  const validasi = v.validate(req.body, schema);

  if (validasi.length) {
    return res.status(400).json(validasi);
  }

  try {
    // Cek apakah nama atau username yang ingin diubah sudah ada di database dan bukan milik teknisi yang sedang diubah
    if (req.body.nama || req.body.username) {
      const existingTeknisi = await Teknisi.findOne({
        where: {
          [Op.or]: [
            { nama: req.body.nama },
            { username: req.body.username }
          ],
          idteknisi: { [Op.ne]: idTeknisi }
        }
      });

      if (existingTeknisi) {
        return res.status(405).json({ message: 'Nama atau username sudah digunakan' });
      }
    }

    teknisi = await teknisi.update(req.body);
    const hasil = req.convertTimestamps(teknisi.toJSON());
    return res.json(hasil);
  } catch (error) {
    return res.status(500).json({ message: 'Terjadi Kesalahan Internal', error: error.message });
  }
});

// Rute DELETE untuk menghapus data teknisi berdasarkan ID (hanya untuk admin)
router.delete('/:idteknisi', adminOnlyMiddleware, async (req, res) => {
  try {
    const idTeknisi = req.params.idteknisi;
    const teknisi = await Teknisi.findByPk(idTeknisi);

    if (!teknisi) {
      return res.status(404).json({ message: 'Data Tidak Ditemukan' });
    }

    await teknisi.destroy();
    return res.json({
      time: req.currentTime,
      message: 'Data telah dihapus'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Terjadi Kesalahan Internal', error: error.message });
  }
});

module.exports = router;
