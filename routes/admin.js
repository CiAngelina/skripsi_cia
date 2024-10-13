const express = require('express');
const router = express.Router();
const Validator = require('fastest-validator');
const { Op } = require('sequelize');
const { Admin } = require('../models');
const v = new Validator();
const { timezoneMiddleware, authMiddleware } = require('../middleware');

// Middleware untuk pengaturan timezone
router.use(timezoneMiddleware);

// Middleware untuk memastikan hanya admin yang dapat mengakses rute ini
router.use(authMiddleware({ allowAdmin: true, allowTeknisi: false }));

// Untuk melihat data admin
router.get('/', async (req, res) => {
  try {
    const adminList = await Admin.findAll();
    const result = adminList.map(admin => req.convertTimestamps(admin.toJSON()));
    return res.json(result);
  } catch (error) {
    console.error('Error fetching admin list:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Untuk melihat data admin berdasarkan ID
router.get('/:idadmin', async (req, res) => {
  try {
    const { idadmin } = req.params;
    const admin = await Admin.findByPk(idadmin);

    if (!admin) {
      return res.status(404).json({ message: 'Data Tidak Ditemukan' });
    }

    const result = req.convertTimestamps(admin.toJSON());
    return res.json(result);
  } catch (error) {
    console.error('Error fetching admin data:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Untuk menambah data admin
router.post('/', async (req, res) => {
  const schema = {
    nama: { type: 'string', empty: false },
    username: { type: 'string', empty: false },
    pass: { type: 'string', empty: false }
  };

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res.status(400).json(validate);
  }

  try {
    // Periksa apakah nama atau username sudah ada di database
    const existingAdmin = await Admin.findOne({
      where: {
        [Op.or]: [
          { nama: req.body.nama },
          { username: req.body.username }
        ]
      }
    });

    if (existingAdmin) {
      return res.status(405).json({ message: 'Nama atau username sudah digunakan' });
    }

    const admin = await Admin.create(req.body);
    const result = req.convertTimestamps(admin.toJSON());
    return res.json(result);
  } catch (error) {
    console.error('Error creating admin data:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Untuk memperbarui data admin
router.put('/:idadmin', async (req, res) => {
  const { idadmin } = req.params;

  try {
    let admin = await Admin.findByPk(idadmin);

    if (!admin) {
      return res.status(404).json({ message: 'Data Tidak Ada' });
    }

    // Pastikan bahwa setidaknya ada satu field yang akan diupdate
    if (!req.body.nama && !req.body.username && !req.body.pass) {
      return res.status(407).json({ message: 'Tidak ada data yang diberikan untuk diperbarui' });
    }

    // Pastikan data yang dikirimkan tidak berupa string kosong
    const schema = {
      nama: { type: 'string', optional: true, min: 1 },
      username: { type: 'string', optional: true, min: 1 },
      pass: { type: 'string', optional: true, min: 1 }
    };

    const validate = v.validate(req.body, schema);

    if (validate.length) {
      return res.status(400).json(validate);
    }

    // Cek apakah nama atau username yang ingin diubah sudah ada di database dan bukan milik admin yang sedang diubah
    if (req.body.nama || req.body.username) {
      const existingAdmin = await Admin.findOne({
        where: {
          [Op.or]: [
            { nama: req.body.nama },
            { username: req.body.username }
          ],
          idadmin: { [Op.ne]: idadmin }
        }
      });

      if (existingAdmin) {
        return res.status(400).json({ message: 'Nama atau username sudah digunakan' });
      }
    }

    admin = await admin.update(req.body);
    const result = req.convertTimestamps(admin.toJSON());
    return res.json(result);
  } catch (error) {
    console.error('Error updating admin data:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Untuk menghapus data admin
router.delete('/:idadmin', async (req, res) => {
  const { idadmin } = req.params;

  try {
    const admin = await Admin.findByPk(idadmin);

    if (!admin) {
      return res.status(404).json({ message: 'Data Tidak Ditemukan' });
    }

    await admin.destroy();
    return res.json({
      time: req.currentTime,
      message: 'Data telah dihapus'
    });
  } catch (error) {
    console.error('Error deleting admin data:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
