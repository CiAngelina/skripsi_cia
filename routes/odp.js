// const express = require('express');
// const router = express.Router();
// const Validator = require('fastest-validator');
// const { Odp, Sektor } = require('../models');
// const v = new Validator();
// // const timezoneMiddleware = require('../middleware/timezone');
// // const authMiddleware = require('../middleware/authMiddleware');
// const { timezoneMiddleware, authMiddleware} = require('../middleware'); 

// // Gunakan middleware CORS
// // router.use(corsMiddleware);


// // Middleware untuk pengaturan timezone
// router.use(timezoneMiddleware);

// // Middleware untuk memastikan hanya admin yang dapat mengakses rute ini
// router.use(authMiddleware({ allowAdmin: true, allowTeknisi: false }));

// // Helper function to format the result
// const formatResult = (odp) => {
//   return {
//     idodp: odp.idodp,
//     namaodp: odp.namaodp,
//     sektor: `${odp.Sektor.idsektor} | ${odp.Sektor.wilayahsektor}`, // Format ID dan nama sektor
//     createdAt: odp.createdAt,
//     updatedAt: odp.updatedAt
//   };
// };

// // Untuk melihat semua data ODP
// router.get('/', async (req, res) => {
//   try {
//     const odpList = await Odp.findAll({
//       include: [
//         {
//           model: Sektor,
//           attributes: ['idsektor', 'wilayahsektor'] // Sesuaikan dengan atribut yang ingin ditampilkan dari tabel Sektor
//         }
//       ]
//     });

//     const result = odpList.map(odp => {
//       const formattedData = formatResult(odp.toJSON());
//       return req.convertTimestamps(formattedData);
//     });

//     return res.json(result);
//   } catch (error) {
//     return res.status(500).json({ message: 'Error mengambil data', error: error.message });
//   }
// });

// // Untuk melihat data ODP berdasarkan ID
// router.get('/:idodp', async (req, res) => {
//   try {
//     const idodp = req.params.idodp;
//     const odp = await Odp.findByPk(idodp, {
//       include: [
//         {
//           model: Sektor,
//           attributes: ['idsektor', 'wilayahsektor'] // Sesuaikan dengan atribut yang ingin ditampilkan dari tabel Sektor
//         }
//       ]
//     });

//     if (!odp) {
//       return res.status(404).json({ message: 'Data tidak ditemukan' });
//     }

//     const formattedData = formatResult(odp.toJSON());
//     const result = req.convertTimestamps(formattedData);

//     return res.json(result);
//   } catch (error) {
//     return res.status(500).json({ message: 'Error mengambil data', error: error.message });
//   }
// });

// // Untuk melihat data ODP berdasarkan nama sektor
// router.get('/by-name/:namaSektor', async (req, res) => {
//   try {
//     const namaSektor = req.params.namaSektor;
//     const odpList = await Odp.findAll({
//       include: [
//         {
//           model: Sektor,
//           attributes: ['idsektor', 'wilayahsektor'],
//           where: {
//             wilayahsektor: namaSektor
//           }
//         }
//       ]
//     });

//     if (odpList.length === 0) {
//       return res.status(404).json({ message: 'Data tidak ditemukan' });
//     }

//     const result = odpList.map(odp => {
//       const formattedData = formatResult(odp.toJSON());
//       return req.convertTimestamps(formattedData);
//     });

//     return res.json(result);
//   } catch (error) {
//     return res.status(500).json({ message: 'Error mengambil data', error: error.message });
//   }
// });


// // Untuk menambah data ODP
// router.post('/', async (req, res) => {
//   req.body.idsektor = Number(req.body.idsektor); // Konversi idsektor menjadi angka

//   const schema = {
//     namaodp: { type: "string", empty: false },
//     idsektor: { type: "number", empty: false }
//   };

//   const validate = v.validate(req.body, schema);

//   if (validate.length) {
//     return res.status(400).json(validate);
//   }

//   try {
//     const odp = await Odp.create(req.body);
//     const result = req.convertTimestamps(odp.toJSON());
//     res.status(200).json(result);
//   } catch (error) {
//     return res.status(500).json({ message: 'Tidak bisa menambah data', error: error.message });
//   }
// });

// // Untuk mengedit data ODP berdasarkan ID
// router.put('/:idodp', async (req, res) => {
//   const idodp = req.params.idodp;
//   let odp = await Odp.findByPk(idodp);

//   if (!odp) {
//     return res.status(404).json({ message: 'Data tidak ditemukan' });
//   }

//   if (req.body.idsektor !== undefined) {
//     req.body.idsektor = Number(req.body.idsektor); // Konversi idsektor menjadi angka jika ada
//   }

//   const schema = {
//     namaodp: 'string|optional',
//     idsektor: 'number|optional'
//   };

//   const validate = v.validate(req.body, schema);

//   if (validate.length) {
//     return res.status(400).json(validate);
//   }

//   try {
//     odp = await odp.update(req.body);
//     const result = req.convertTimestamps(odp.toJSON());
//     res.json(result);
//   } catch (error) {
//     return res.status(500).json({ message: 'Error memperbarui data', error: error.message });
//   }
// });

// // Untuk menghapus data ODP berdasarkan ID
// router.delete('/:idodp', async (req, res) => {
//   const idodp = req.params.idodp;
//   try {
//     const odp = await Odp.findByPk(idodp);

//     if (!odp) {
//       return res.status(404).json({ message: 'Data tidak ditemukan' });
//     }

//     await odp.destroy();
//     return res.json({
//       time: req.currentTime, // Menggunakan waktu saat ini dari middleware timezone
//       message: 'Data telah dihapus'
//     });
//   } catch (error) {
//     return res.status(500).json({ message: 'Error menghapus data', error: error.message });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const { Odp, Sektor } = require('../models');
const Validator = require('fastest-validator');
const { timezoneMiddleware, authMiddleware } = require('../middleware');

const v = new Validator();

// Middleware untuk pengaturan timezone
router.use(timezoneMiddleware);

// Middleware untuk memastikan hanya admin yang dapat mengakses rute ini
router.use(authMiddleware({ allowAdmin: true, allowTeknisi: false }));

// Helper function untuk format data ODP
const formatResult = (odp) => ({
  idodp: odp.idodp,
  namaodp: odp.namaodp,
  sektor: `${odp.Sektor.idsektor} | ${odp.Sektor.wilayahsektor}`, // Format ID dan nama sektor
  createdAt: odp.createdAt,
  updatedAt: odp.updatedAt
});

// Rute GET untuk melihat semua data ODP
router.get('/', async (req, res) => {
  try {
    const odpList = await Odp.findAll({
      include: [
        {
          model: Sektor,
          attributes: ['idsektor', 'wilayahsektor'] // Sesuaikan dengan atribut yang ingin ditampilkan dari tabel Sektor
        }
      ]
    });

    const result = odpList.map(odp => req.convertTimestamps(formatResult(odp.toJSON())));

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Error mengambil data', error: error.message });
  }
});

// Rute GET untuk melihat data ODP berdasarkan ID
router.get('/:idodp', async (req, res) => {
  try {
    const { idodp } = req.params;
    const odp = await Odp.findByPk(idodp, {
      include: [
        {
          model: Sektor,
          attributes: ['idsektor', 'wilayahsektor']
        }
      ]
    });

    if (!odp) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    const result = req.convertTimestamps(formatResult(odp.toJSON()));
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Error mengambil data', error: error.message });
  }
});

// Rute GET untuk melihat data ODP berdasarkan nama sektor
router.get('/by-name/:namaSektor', async (req, res) => {
  try {
    const { namaSektor } = req.params;
    const odpList = await Odp.findAll({
      include: [
        {
          model: Sektor,
          attributes: ['idsektor', 'wilayahsektor'],
          where: { wilayahsektor: namaSektor }
        }
      ]
    });

    if (odpList.length === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    const result = odpList.map(odp => req.convertTimestamps(formatResult(odp.toJSON())));
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Error mengambil data', error: error.message });
  }
});

// Rute POST untuk menambah data ODP
router.post('/', async (req, res) => {
  req.body.idsektor = Number(req.body.idsektor); // Konversi idsektor menjadi angka

  const schema = {
    namaodp: { type: "string", empty: false },
    idsektor: { type: "number", empty: false }
  };

  const validationErrors = v.validate(req.body, schema);

  if (validationErrors.length) {
    return res.status(400).json(validationErrors);
  }

  try {
    const odp = await Odp.create(req.body);
    const result = req.convertTimestamps(odp.toJSON());
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Tidak bisa menambah data', error: error.message });
  }
});

// Rute PUT untuk mengedit data ODP berdasarkan ID
router.put('/:idodp', async (req, res) => {
  const { idodp } = req.params;
  let odp = await Odp.findByPk(idodp);

  if (!odp) {
    return res.status(404).json({ message: 'Data tidak ditemukan' });
  }

  if (req.body.idsektor !== undefined) {
    req.body.idsektor = Number(req.body.idsektor); // Konversi idsektor menjadi angka jika ada
  }

  const schema = {
    namaodp: 'string|optional',
    idsektor: 'number|optional'
  };

  const validationErrors = v.validate(req.body, schema);

  if (validationErrors.length) {
    return res.status(400).json(validationErrors);
  }

  try {
    odp = await odp.update(req.body);
    const result = req.convertTimestamps(odp.toJSON());
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Error memperbarui data', error: error.message });
  }
});

// Rute DELETE untuk menghapus data ODP berdasarkan ID
router.delete('/:idodp', async (req, res) => {
  const { idodp } = req.params;

  try {
    const odp = await Odp.findByPk(idodp);

    if (!odp) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    await odp.destroy();
    return res.json({
      time: req.currentTime,
      message: 'Data telah dihapus'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error menghapus data', error: error.message });
  }
});

module.exports = router;
