// const express = require('express');
// const router = express.Router();
// const Validator = require('fastest-validator');
// const { Sektor } = require('../models');
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

// // Untuk melihat data
// router.get('/', async (req, res) => {
//   try {
//     const sektorList = await Sektor.findAll();
//     const result = sektorList.map(sektor => req.convertTimestamps(sektor.toJSON()));
//     return res.json(result);
//   } catch (error) {
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // Untuk melihat data berdasarkan ID
// router.get('/:idsektor', async (req, res) => {
//   try {
//     const idsektor = req.params.idsektor;
//     const sektor = await Sektor.findByPk(idsektor);
//     if (!sektor) {
//       return res.status(404).json({ message: 'Data Tidak Ditemukan' });
//     }
//     const result = req.convertTimestamps(sektor.toJSON());
//     return res.json(result);
//   } catch (error) {
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // Untuk menambah data
// router.post('/', async (req, res) => {
//   const schema = {
//     wilayahsektor: { type: "string", empty: false }
//   };

//   const validate = v.validate(req.body, schema);

//   if (validate.length) {
//     return res.status(400).json(validate);
//   }

//   try {
//     const sektor = await Sektor.create(req.body);
//     const result = req.convertTimestamps(sektor.toJSON());
//     return res.json(result);
//   } catch (error) {
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // Untuk mengedit data
// router.put('/:idsektor', async (req, res) => {
//   const idsektor = req.params.idsektor;
//   let sektor = await Sektor.findByPk(idsektor);

//   if (!sektor) {
//     return res.status(404).json({ message: 'Data Tidak Ada' });
//   }

//   const schema = {
//     wilayahsektor: 'string|optional'
//   };

//   const validate = v.validate(req.body, schema);

//   if (validate.length) {
//     return res.status(400).json(validate);
//   }

//   try {
//     sektor = await sektor.update(req.body);
//     const result = req.convertTimestamps(sektor.toJSON());
//     return res.json(result);
//   } catch (error) {
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // Untuk menghapus data
// router.delete('/:idsektor', async (req, res) => {
//   try {
//     const idsektor = req.params.idsektor;
//     const sektor = await Sektor.findByPk(idsektor);

//     if (!sektor) {
//       return res.status(404).json({ error: 'Data Tidak Ditemukan' });
//     }

//     await sektor.destroy();
//     return res.json({
//       time:  req.currentTime,
//       message: 'Data telah dihapus'
//     });
//   } catch (error) {
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const Validator = require('fastest-validator');
const { Sektor } = require('../models');
const { timezoneMiddleware, authMiddleware } = require('../middleware');
const v = new Validator();

// Middleware untuk pengaturan timezone
router.use(timezoneMiddleware);

// Middleware untuk memastikan hanya admin yang dapat mengakses rute ini
router.use(authMiddleware({ allowAdmin: true, allowTeknisi: false }));

// Rute GET untuk melihat semua data sektor
router.get('/', async (req, res) => {
  try {
    const sektorList = await Sektor.findAll();
    const result = sektorList.map(sektor => req.convertTimestamps(sektor.toJSON()));
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Terjadi Kesalahan Internal', error: error.message });
  }
});

// Rute GET untuk melihat data sektor berdasarkan ID
router.get('/:idsektor', async (req, res) => {
  try {
    const idSektor = req.params.idsektor;
    const sektor = await Sektor.findByPk(idSektor);
    if (!sektor) {
      return res.status(404).json({ message: 'Data Tidak Ditemukan' });
    }
    const result = req.convertTimestamps(sektor.toJSON());
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Terjadi Kesalahan Internal', error: error.message });
  }
});

// Rute POST untuk menambah data sektor
router.post('/', async (req, res) => {
  const schema = {
    wilayahsektor: { type: "string", empty: false }
  };

  const validationErrors = v.validate(req.body, schema);

  if (validationErrors.length) {
    return res.status(400).json(validationErrors);
  }

  try {
    const sektor = await Sektor.create(req.body);
    const result = req.convertTimestamps(sektor.toJSON());
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Terjadi Kesalahan Internal', error: error.message });
  }
});

// Rute PUT untuk mengedit data sektor berdasarkan ID
router.put('/:idsektor', async (req, res) => {
  const idSektor = req.params.idsektor;
  let sektor = await Sektor.findByPk(idSektor);

  if (!sektor) {
    return res.status(404).json({ message: 'Data Tidak Ada' });
  }

  const schema = {
    wilayahsektor: { type: "string|optional" }
  };

  const validationErrors = v.validate(req.body, schema);

  if (validationErrors.length) {
    return res.status(400).json(validationErrors);
  }

  try {
    sektor = await sektor.update(req.body);
    const result = req.convertTimestamps(sektor.toJSON());
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Terjadi Kesalahan Internal', error: error.message });
  }
});

// Rute DELETE untuk menghapus data sektor berdasarkan ID
router.delete('/:idsektor', async (req, res) => {
  try {
    const idSektor = req.params.idsektor;
    const sektor = await Sektor.findByPk(idSektor);

    if (!sektor) {
      return res.status(404).json({ message: 'Data Tidak Ditemukan' });
    }

    await sektor.destroy();
    return res.json({
      time: req.currentTime,
      message: 'Data telah dihapus'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Terjadi Kesalahan Internal', error: error.message });
  }
});

module.exports = router;
