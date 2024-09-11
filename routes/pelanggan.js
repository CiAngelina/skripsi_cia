// const express = require('express');
// const router = express.Router();
// const { Pelanggan } = require("../models");
// const Validator = require('fastest-validator');
// const v = new Validator();
// // const timezoneMiddleware = require('../middleware/timezone');
// // const authMiddleware = require('../middleware/authMiddleware'); 
// const { timezoneMiddleware, authMiddleware } = require('../middleware'); 

// // Gunakan middleware CORS
// // router.use(corsMiddleware);


// // Middleware untuk pengaturan timezone
// router.use(timezoneMiddleware);

// // Middleware untuk memastikan hanya admin yang dapat mengakses rute ini
// router.use(authMiddleware({ allowAdmin: true, allowTeknisi: false }));

// // Untuk melihat semua data pelanggan
// router.get('/', async (req, res) => {
//   try {
//     const pelangganList = await Pelanggan.findAll();
//     const result = pelangganList.map(pelanggan => req.convertTimestamps(pelanggan.toJSON()));
//     return res.json(result);
//   } catch (error) {
//     return res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// });

// // Untuk melihat data pelanggan berdasarkan ID
// router.get('/:idpelanggan', async (req, res) => {
//   try {
//     const idpelanggan = req.params.idpelanggan;
//     const pelanggan = await Pelanggan.findByPk(idpelanggan);
//     if (!pelanggan) {
//       return res.status(404).json({ message: 'Data Tidak Ditemukan' });
//     }
//     const result = req.convertTimestamps(pelanggan.toJSON());
//     return res.json(result);
//   } catch (error) {
//     return res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// });

// // Untuk menambah data pelanggan
// router.post('/', async (req, res) => {
//   const schema = {
//     nama: { type: "string", empty: false },
//     nohp: { type: "string", empty: false },
//     alamat: { type: "string", empty: false }
//   };

//   const validate = v.validate(req.body, schema);

//   if (validate.length) {
//     return res.status(400).json(validate);
//   }

//   try {
//     const pelanggan = await Pelanggan.create(req.body);
//     const result = req.convertTimestamps(pelanggan.toJSON());
//     return res.status(201).json(result);
//   } catch (error) {
//     return res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// });

// // Untuk mengedit data pelanggan berdasarkan ID
// router.put('/:idpelanggan', async (req, res) => {
//   const idpelanggan = req.params.idpelanggan;
//   let pelanggan = await Pelanggan.findByPk(idpelanggan);

//   if (!pelanggan) {
//     return res.status(404).json({ message: 'Data Tidak Ada' });
//   }

//   const schema = {
//     nama: 'string|optional',
//     nohp: 'string|optional',
//     alamat: 'string|optional'
//   };

//   const validate = v.validate(req.body, schema);

//   if (validate.length) {
//     return res.status(400).json(validate);
//   }

//   try {
//     pelanggan = await pelanggan.update(req.body);
//     const result = req.convertTimestamps(pelanggan.toJSON());
//     return res.json(result);
//   } catch (error) {
//     return res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// });

// // Untuk menghapus data pelanggan berdasarkan ID
// router.delete('/:idpelanggan', async (req, res) => {
//   try {
//     const idpelanggan = req.params.idpelanggan;
//     const pelanggan = await Pelanggan.findByPk(idpelanggan);

//     if (!pelanggan) {
//       return res.status(404).json({ message: 'Data Tidak Ditemukan' });
//     }

//     await pelanggan.destroy();
//     return res.json({
//       time: req.currentTime,
//       message: 'Data telah dihapus'
//     });
//   } catch (error) {
//     return res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const { Pelanggan } = require('../models');
const Validator = require('fastest-validator');
const { timezoneMiddleware, authMiddleware } = require('../middleware');

const v = new Validator();

// Middleware untuk pengaturan timezone
router.use(timezoneMiddleware);

// Middleware untuk memastikan hanya admin yang dapat mengakses rute ini
router.use(authMiddleware({ allowAdmin: true, allowTeknisi: false }));

// Rute GET untuk melihat semua data pelanggan
router.get('/', async (req, res) => {
  try {
    const pelangganList = await Pelanggan.findAll();
    const result = pelangganList.map(pelanggan => req.convertTimestamps(pelanggan.toJSON()));
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Terjadi Kesalahan Internal', error: error.message });
  }
});

// Rute GET untuk melihat data pelanggan berdasarkan ID
router.get('/:idpelanggan', async (req, res) => {
  try {
    const idPelanggan = req.params.idpelanggan;
    const pelanggan = await Pelanggan.findByPk(idPelanggan);
    if (!pelanggan) {
      return res.status(404).json({ message: 'Data Tidak Ditemukan' });
    }
    const result = req.convertTimestamps(pelanggan.toJSON());
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Terjadi Kesalahan Internal', error: error.message });
  }
});

// Rute POST untuk menambah data pelanggan
router.post('/', async (req, res) => {
  const schema = {
    nama: { type: "string", empty: false },
    nohp: { type: "string", empty: false },
    alamat: { type: "string", empty: false }
  };

  const validationErrors = v.validate(req.body, schema);

  if (validationErrors.length) {
    return res.status(400).json(validationErrors);
  }

  try {
    const pelanggan = await Pelanggan.create(req.body);
    const result = req.convertTimestamps(pelanggan.toJSON());
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Terjadi Kesalahan Internal', error: error.message });
  }
});

// Rute PUT untuk mengedit data pelanggan berdasarkan ID
router.put('/:idpelanggan', async (req, res) => {
  const idPelanggan = req.params.idpelanggan;
  let pelanggan = await Pelanggan.findByPk(idPelanggan);

  if (!pelanggan) {
    return res.status(404).json({ message: 'Data Tidak Ada' });
  }

  const schema = {
    nama: 'string|optional',
    nohp: 'string|optional',
    alamat: 'string|optional'
  };

  const validationErrors = v.validate(req.body, schema);

  if (validationErrors.length) {
    return res.status(400).json(validationErrors);
  }

  try {
    pelanggan = await pelanggan.update(req.body);
    const result = req.convertTimestamps(pelanggan.toJSON());
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Terjadi Kesalahan Internal', error: error.message });
  }
});

// Rute DELETE untuk menghapus data pelanggan berdasarkan ID
router.delete('/:idpelanggan', async (req, res) => {
  try {
    const idPelanggan = req.params.idpelanggan;
    const pelanggan = await Pelanggan.findByPk(idPelanggan);

    if (!pelanggan) {
      return res.status(404).json({ message: 'Data Tidak Ditemukan' });
    }

    await pelanggan.destroy();
    return res.json({
      time: req.currentTime,
      message: 'Data telah dihapus'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Terjadi Kesalahan Internal', error: error.message });
  }
});

module.exports = router;
