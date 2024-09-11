// const express = require('express');
// const router = express.Router();
// const Validator = require('fastest-validator');
// const { Keahlian_Teknisi, Teknisi, Keahlian } = require('../models');
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

// const formatResult = (keahlianTeknisi) => {
//   return {
//     idkt: keahlianTeknisi.idkt,
//     teknisi: `${keahlianTeknisi.Teknisi.idteknisi} | ${keahlianTeknisi.Teknisi.nama}`,
//     keahlian: `${keahlianTeknisi.Keahlian.idkeahlian} | ${keahlianTeknisi.Keahlian.namaskill}`,
//     createdAt: keahlianTeknisi.createdAt,
//     updatedAt: keahlianTeknisi.updatedAt
//   };
// };

// // Untuk melihat semua data keahlian teknisi
// router.get('/', async (req, res) => {
//   try {
//     const keahlianTeknisiList = await Keahlian_Teknisi.findAll({
//       include: [
//         {
//           model: Teknisi,
//           attributes: ['idteknisi', 'nama'] // dari tabel Teknisi
//         },
//         {
//           model: Keahlian,
//           attributes: ['idkeahlian', 'namaskill'] // tabel Keahlian
//         }
//       ]
//     });

//     const result = keahlianTeknisiList.map(keahlian => {
//       const formattedData = formatResult(keahlian.toJSON());
//       return req.convertTimestamps(formattedData);
//     });

//     return res.json(result);
//   } catch (error) {
//     return res.status(500).json({ message: 'Error mengambil data', error: error.message });
//   }
// });

// // Untuk melihat data keahlian teknisi berdasarkan ID
// router.get('/:idkt', async (req, res) => {
//   try {
//     const idkt = req.params.idkt;
//     const keahlianTeknisi = await Keahlian_Teknisi.findByPk(idkt, {
//       include: [
//         {
//           model: Teknisi,
//           attributes: ['idteknisi', 'nama'] // ditampilkan dari tabel Teknisi
//         },
//         {
//           model: Keahlian,
//           attributes: ['idkeahlian', 'namaskill'] // ditampilkan dari tabel Keahlian
//         }
//       ]
//     });

//     if (!keahlianTeknisi) {
//       return res.status(404).json({ message: 'Data tidak ditemukan' });
//     }

//     const formattedData = formatResult(keahlianTeknisi.toJSON());
//     const result = req.convertTimestamps(formattedData);

//     return res.json(result);
//   } catch (error) {
//     return res.status(500).json({ message: 'Error mengambil data', error: error.message });
//   }
// });

// // Untuk menambah data keahlian teknisi
// router.post('/', async (req, res) => {
//   // Konversi idteknisi dan idkeahlian menjadi angka
//   req.body.idteknisi = Number(req.body.idteknisi);
//   req.body.idkeahlian = Number(req.body.idkeahlian);

//   const schema = {
//     idteknisi: { type: "number", empty: false },
//     idkeahlian: { type: "number", empty: false }
//   };

//   const validate = v.validate(req.body, schema);

//   if (validate.length) {
//     return res.status(400).json(validate);
//   }

//   try {
//     const keahlianTeknisi = await Keahlian_Teknisi.create(req.body);
//     const result = req.convertTimestamps(keahlianTeknisi.toJSON());
//     res.status(200).json(result);
//   } catch (error) {
//     return res.status(500).json({ message: 'Error menambah data', error: error.message });
//   }
// });

// // Untuk mengedit data keahlian teknisi berdasarkan ID
// router.put('/:idkt', async (req, res) => {
//   const idkt = req.params.idkt;
//   let keahlianTeknisi = await Keahlian_Teknisi.findByPk(idkt);

//   if (!keahlianTeknisi) {
//     return res.status(404).json({ message: 'Data tidak ditemukan' });
//   }

//   // Konversi idteknisi dan idkeahlian menjadi angka jika ada
//   if (req.body.idteknisi !== undefined) {
//     req.body.idteknisi = Number(req.body.idteknisi);
//   }
//   if (req.body.idkeahlian !== undefined) {
//     req.body.idkeahlian = Number(req.body.idkeahlian);
//   }

//   const schema = {
//     idteknisi: 'number|optional',
//     idkeahlian: 'number|optional'
//   };

//   const validate = v.validate(req.body, schema);

//   if (validate.length) {
//     return res.status(400).json(validate);
//   }

//   try {
//     keahlianTeknisi = await keahlianTeknisi.update(req.body);
//     const result = req.convertTimestamps(keahlianTeknisi.toJSON());
//     res.json(result);
//   } catch (error) {
//     return res.status(500).json({ message: 'Error memperbarui data', error: error.message });
//   }
// });

// // Untuk menghapus data keahlian teknisi berdasarkan ID
// router.delete('/:idkt', async (req, res) => {
//   const idkt = req.params.idkt;
//   try {
//     const keahlianTeknisi = await Keahlian_Teknisi.findByPk(idkt);

//     if (!keahlianTeknisi) {
//       return res.status(404).json({ message: 'Data tidak ditemukan' });
//     }

//     await keahlianTeknisi.destroy();
//     return res.json({
//       time: req.currentTime,
//       message: 'Data telah dihapus'
//     });
//   } catch (error) {
//     return res.status(500).json({ message: 'Error menghapus data', error: error.message });
//   }
// });

// // Untuk melihat data keahlian teknisi berdasarkan nama teknisi
// router.get('/by-name/:nama', async (req, res) => {
//   try {
//     const namaTeknisi = req.params.nama;
//     const keahlianTeknisiList = await Keahlian_Teknisi.findAll({
//       include: [
//         {
//           model: Teknisi,
//           attributes: ['idteknisi', 'nama'],
//           where: {
//             nama: namaTeknisi
//           }
//         },
//         {
//           model: Keahlian,
//           attributes: ['idkeahlian', 'namaskill']
//         }
//       ]
//     });

//     if (keahlianTeknisiList.length === 0) {
//       return res.status(404).json({ message: 'Data tidak ditemukan' });
//     }

//     const result = keahlianTeknisiList.map(keahlian => {
//       const formattedData = formatResult(keahlian.toJSON());
//       return req.convertTimestamps(formattedData);
//     });

//     return res.json(result);
//   } catch (error) {
//     return res.status(500).json({ message: 'Error mengambil data', error: error.message });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Validator = require('fastest-validator');
const { Keahlian_Teknisi, Teknisi, Keahlian } = require('../models');
const v = new Validator();
const { timezoneMiddleware, authMiddleware } = require('../middleware');

// Middleware untuk pengaturan timezone
router.use(timezoneMiddleware);

// Middleware untuk memastikan hanya admin yang dapat mengakses rute ini
router.use(authMiddleware({ allowAdmin: true, allowTeknisi: false }));

const formatResult = (keahlianTeknisi) => ({
  idkt: keahlianTeknisi.idkt,
  teknisi: `${keahlianTeknisi.Teknisi.idteknisi} | ${keahlianTeknisi.Teknisi.nama}`,
  keahlian: `${keahlianTeknisi.Keahlian.idkeahlian} | ${keahlianTeknisi.Keahlian.namaskill}`,
  createdAt: keahlianTeknisi.createdAt,
  updatedAt: keahlianTeknisi.updatedAt
});

// Untuk melihat semua data keahlian teknisi
router.get('/', async (req, res) => {
  try {
    const keahlianTeknisiList = await Keahlian_Teknisi.findAll({
      include: [
        { model: Teknisi, attributes: ['idteknisi', 'nama'] },
        { model: Keahlian, attributes: ['idkeahlian', 'namaskill'] }
      ]
    });

    const result = keahlianTeknisiList.map(keahlian => {
      const formattedData = formatResult(keahlian.toJSON());
      return req.convertTimestamps(formattedData);
    });

    return res.json(result);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    return res.status(500).json({ message: 'Error mengambil data', error: error.message });
  }
});

// Untuk melihat data keahlian teknisi berdasarkan ID
router.get('/:idkt', async (req, res) => {
  try {
    const { idkt } = req.params;
    const keahlianTeknisi = await Keahlian_Teknisi.findByPk(idkt, {
      include: [
        { model: Teknisi, attributes: ['idteknisi', 'nama'] },
        { model: Keahlian, attributes: ['idkeahlian', 'namaskill'] }
      ]
    });

    if (!keahlianTeknisi) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    const formattedData = formatResult(keahlianTeknisi.toJSON());
    const result = req.convertTimestamps(formattedData);

    return res.json(result);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    return res.status(500).json({ message: 'Error mengambil data', error: error.message });
  }
});

// Untuk menambah data keahlian teknisi
router.post('/', async (req, res) => {
  // Konversi idteknisi dan idkeahlian menjadi angka
  req.body.idteknisi = Number(req.body.idteknisi);
  req.body.idkeahlian = Number(req.body.idkeahlian);

  const schema = {
    idteknisi: { type: 'number', empty: false },
    idkeahlian: { type: 'number', empty: false }
  };

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res.status(400).json(validate);
  }

  try {
    const keahlianTeknisi = await Keahlian_Teknisi.create(req.body);
    const result = req.convertTimestamps(keahlianTeknisi.toJSON());
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error creating data:', error.message);
    return res.status(500).json({ message: 'Error menambah data', error: error.message });
  }
});

// Untuk mengedit data keahlian teknisi berdasarkan ID
router.put('/:idkt', async (req, res) => {
  const { idkt } = req.params;

  try {
    let keahlianTeknisi = await Keahlian_Teknisi.findByPk(idkt);

    if (!keahlianTeknisi) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    // Konversi idteknisi dan idkeahlian menjadi angka jika ada
    if (req.body.idteknisi !== undefined) {
      req.body.idteknisi = Number(req.body.idteknisi);
    }
    if (req.body.idkeahlian !== undefined) {
      req.body.idkeahlian = Number(req.body.idkeahlian);
    }

    const schema = {
      idteknisi: 'number|optional',
      idkeahlian: 'number|optional'
    };

    const validate = v.validate(req.body, schema);

    if (validate.length) {
      return res.status(400).json(validate);
    }

    keahlianTeknisi = await keahlianTeknisi.update(req.body);
    const result = req.convertTimestamps(keahlianTeknisi.toJSON());
    return res.json(result);
  } catch (error) {
    console.error('Error updating data:', error.message);
    return res.status(500).json({ message: 'Error memperbarui data', error: error.message });
  }
});

// Untuk menghapus data keahlian teknisi berdasarkan ID
router.delete('/:idkt', async (req, res) => {
  const { idkt } = req.params;

  try {
    const keahlianTeknisi = await Keahlian_Teknisi.findByPk(idkt);

    if (!keahlianTeknisi) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    await keahlianTeknisi.destroy();
    return res.json({
      time: req.currentTime,
      message: 'Data telah dihapus'
    });
  } catch (error) {
    console.error('Error deleting data:', error.message);
    return res.status(500).json({ message: 'Error menghapus data', error: error.message });
  }
});

// Untuk melihat data keahlian teknisi berdasarkan nama teknisi
router.get('/by-name/:nama', async (req, res) => {
  try {
    const { nama } = req.params;
    const keahlianTeknisiList = await Keahlian_Teknisi.findAll({
      include: [
        {
          model: Teknisi,
          attributes: ['idteknisi', 'nama'],
          where: { nama }
        },
        { model: Keahlian, attributes: ['idkeahlian', 'namaskill'] }
      ]
    });

    if (keahlianTeknisiList.length === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    const result = keahlianTeknisiList.map(keahlian => {
      const formattedData = formatResult(keahlian.toJSON());
      return req.convertTimestamps(formattedData);
    });

    return res.json(result);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    return res.status(500).json({ message: 'Error mengambil data', error: error.message });
  }
});

module.exports = router;
