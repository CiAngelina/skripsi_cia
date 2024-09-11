// const express = require('express');
// const router = express.Router();
// const Validator = require('fastest-validator');
// const { Keahlian } = require("../models");
// const v = new Validator();
// // const timezoneMiddleware = require('../middleware/timezone');
// // const authMiddleware = require('../middleware/authMiddleware'); // Tambahkan import authMiddleware
// const { timezoneMiddleware, authMiddleware } = require('../middleware'); 

// // Gunakan middleware CORS
// // router.use(corsMiddleware);



// // Middleware untuk pengaturan timezone
// router.use(timezoneMiddleware);

// // Middleware untuk memastikan hanya admin yang dapat mengakses rute ini
// router.use(authMiddleware({ allowAdmin: true, allowTeknisi: false }));

// // Untuk melihat semua data keahlian
// router.get('/', async (req, res) => {
//   try {
//     const keahlianList = await Keahlian.findAll();
//     const result = keahlianList.map(keahlian => req.convertTimestamps(keahlian.toJSON()));
//     return res.json(result);
//   } catch (error) {
//     return res.status(500).json({ message: 'Error fetching data', error: error.message });
//   }
// });

// // Untuk melihat data keahlian berdasarkan ID
// router.get('/:idkeahlian', async (req, res) => {
//   try {
//     const idkeahlian = req.params.idkeahlian;
//     const keahlian = await Keahlian.findByPk(idkeahlian);
//     if (!keahlian) {
//       return res.status(404).json({ message: 'Data Tidak Ditemukan' });
//     }
//     const result = req.convertTimestamps(keahlian.toJSON());
//     return res.json(result);
//   } catch (error) {
//     return res.status(500).json({ message: 'Error fetching data', error: error.message });
//   }
// });

// // Untuk menambah data keahlian
// router.post('/', async (req, res) => {
//   const schema = {
//     namaskill: { type: "string", empty: false },
//     ket: { type: "string", empty: false }
//   };

//   const validate = v.validate(req.body, schema);

//   if (validate.length) {
//     return res.status(400).json(validate);
//   }

//   try {
//     const keahlian = await Keahlian.create(req.body);
//     const result = req.convertTimestamps(keahlian.toJSON());
//     return res.json(result);
//   } catch (error) {
//     return res.status(500).json({ message: 'Error creating data', error: error.message });
//   }
// });

// // Untuk mengedit data keahlian berdasarkan ID
// router.put('/:idkeahlian', async (req, res) => {
//   const idkeahlian = req.params.idkeahlian;
//   let keahlian = await Keahlian.findByPk(idkeahlian);

//   if (!keahlian) {
//     return res.status(404).json({ message: 'Data Tidak Ada' });
//   }

//   const schema = {
//       namaskill: 'string|optional',
//       ket: 'string|optional'
//   };

//   const validate = v.validate(req.body, schema);

//   if (validate.length) {
//     return res.status(400).json(validate);
//   }

//   try {
//     keahlian = await keahlian.update(req.body);
//     const result = req.convertTimestamps(keahlian.toJSON());
//     return res.json(result);
//   } catch (error) {
//     return res.status(500).json({ message: 'Error updating data', error: error.message });
//   }
// });

// // Untuk menghapus data keahlian berdasarkan ID
// router.delete('/:idkeahlian', async (req, res) => {
//   const idkeahlian = req.params.idkeahlian;
//   try {
//     const keahlian = await Keahlian.findByPk(idkeahlian);

//     if (!keahlian) {
//       return res.status(404).json({ message: 'Data Tidak Ditemukan' });
//     }

//     await keahlian.destroy();
//     return res.json({
//       time: req.currentTime,
//       message: 'Data telah dihapus'
//     });
//   } catch (error) {
//     return res.status(500).json({ message: 'Error deleting data', error: error.message });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Validator = require('fastest-validator');
const { Keahlian } = require('../models');
const v = new Validator();
const { timezoneMiddleware, authMiddleware } = require('../middleware');

// Middleware untuk pengaturan timezone
router.use(timezoneMiddleware);

// Middleware untuk memastikan hanya admin yang dapat mengakses rute ini
router.use(authMiddleware({ allowAdmin: true, allowTeknisi: false }));

// Untuk melihat semua data keahlian
router.get('/', async (req, res) => {
  try {
    const keahlianList = await Keahlian.findAll();
    const result = keahlianList.map(keahlian => req.convertTimestamps(keahlian.toJSON()));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
});

// Untuk melihat data keahlian berdasarkan ID
router.get('/:idkeahlian', async (req, res) => {
  try {
    const idkeahlian = req.params.idkeahlian;
    const keahlian = await Keahlian.findByPk(idkeahlian);
    if (!keahlian) {
      return res.status(404).json({ message: 'Data Tidak Ditemukan' });
    }
    const result = req.convertTimestamps(keahlian.toJSON());
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
});

// Untuk menambah data keahlian
router.post('/', async (req, res) => {
  const schema = {
    namaskill: { type: 'string', empty: false },
    ket: { type: 'string', empty: false }
  };

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res.status(400).json(validate);
  }

  try {
    const keahlian = await Keahlian.create(req.body);
    const result = req.convertTimestamps(keahlian.toJSON());
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error creating data', error: error.message });
  }
});

// Untuk mengedit data keahlian berdasarkan ID
router.put('/:idkeahlian', async (req, res) => {
  const idkeahlian = req.params.idkeahlian;
  let keahlian = await Keahlian.findByPk(idkeahlian);

  if (!keahlian) {
    return res.status(404).json({ message: 'Data Tidak Ada' });
  }

  const schema = {
    namaskill: 'string|optional',
    ket: 'string|optional'
  };

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res.status(400).json(validate);
  }

  try {
    keahlian = await keahlian.update(req.body);
    const result = req.convertTimestamps(keahlian.toJSON());
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating data', error: error.message });
  }
});

// Untuk menghapus data keahlian berdasarkan ID
router.delete('/:idkeahlian', async (req, res) => {
  const idkeahlian = req.params.idkeahlian;
  try {
    const keahlian = await Keahlian.findByPk(idkeahlian);

    if (!keahlian) {
      return res.status(404).json({ message: 'Data Tidak Ditemukan' });
    }

    await keahlian.destroy();
    res.json({
      time: req.currentTime,
      message: 'Data telah dihapus'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting data', error: error.message });
  }
});

module.exports = router;
