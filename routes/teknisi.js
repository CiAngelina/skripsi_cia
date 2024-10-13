const express = require('express');
const router = express.Router();
const Validator = require('fastest-validator');
const { Teknisi,Tiket } = require('../models');
const { Op } = require('sequelize');
const { timezoneMiddleware, authMiddleware } = require('../middleware');
const v = new Validator();
const { Sequelize } = require('sequelize');
const generateIdTeknisi = require('../helpers/idGenerator'); // Import fungsi ID



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
    ket: { type: "string", empty: false },
    username: { type: "string", empty: false },
    pass: { type: "string", empty: false },
    kehadiran: { type: "string", empty: false },
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
          // { nama: req.body.nama },
          { username: req.body.username }
        ]
      }
    });

    if (existingTeknisi) {
      return res.status(405).json({ message: 'Username sudah digunakan' });
    }

    // Tambahkan idteknisi setelah validasi berhasil
    const teknisiData = {
      idteknisi: generateIdTeknisi(),
      ...req.body
    };

    const teknisi = await Teknisi.create(teknisiData);
    const hasil = req.convertTimestamps(teknisi.toJSON());
    return res.json(hasil);
  } catch (error) {
    return res.status(500).json({ message: 'Terjadi Kesalahan Internal', error: error.message });
  }
});


// Fungsi untuk memperbarui status teknisi
async function updateKetTeknisi() {
  try {
      const teknisiSelesai = await Tiket.findAll({
          where: {
              status: 'Selesai'
          },
          attributes: ['idteknisi'],
          group: ['idteknisi'],
          having: Sequelize.literal('COUNT(idteknisi) = 3')
      });
      if(
        teknisiSelesai.length === 0 
      ){
        console.log('Tidak Ada Teknisi Yang Menyelesaikan 3 Tiket');
        return;

      } else{
        //  console.log('Teknisi yang ditemukan:', teknisiSelesai);
// Update status ket teknisi
      for (let teknisiData of teknisiSelesai) {
          const idTeknisiSelesai = teknisiData.idteknisi;
          const teknisi = await Teknisi.findByPk(idTeknisiSelesai);

          if (teknisi.ket === 'Not Available') {
              await teknisi.update({ ket: 'Available' });
          }
      }

      console.log('Status teknisi berhasil diperbarui');
      }

      // if (!teknisiSelesai.length) {
      //     console.log('Tidak Ada Teknisi Yang Menyelesaikan 3 Tiket');
      //     return; // Keluarkan jika tidak ada teknisi
      // }

      // // Update status ket teknisi
      // for (let teknisiData of teknisiSelesai) {
      //     const idTeknisiSelesai = teknisiData.idteknisi;
      //     const teknisi = await Teknisi.findByPk(idTeknisiSelesai);

      //     if (teknisi.ket === 'Not Available') {
      //         await teknisi.update({ ket: 'Available' });
      //     }
      // }

      // console.log('Status teknisi berhasil diperbarui');
  } catch (error) {
      console.log('Terjadi Kesalahan Internal:', error.message);
  }
}

// Rute PUT untuk mengedit data teknisi berdasarkan ID
router.put('/:idteknisi', async (req, res) => {
  const idTeknisi = req.params.idteknisi;
  let teknisi = await Teknisi.findByPk(idTeknisi);

  if (!teknisi) {
    return res.status(404).json({ message: 'Data Tidak Ada' });
  }

  // Pastikan ada data yang diberikan untuk diperbarui
  if (!req.body.nama && !req.body.username && !req.body.pass && !req.body.ket) {
    return res.status(400).json({ message: 'Tidak ada data yang diberikan untuk diperbarui' });
  }

  const schema = {
    nama: { type: "string", optional: true, empty: false, min: 1 },
    username: { type: "string", optional: true, empty: false, min: 1 },
    pass: { type: "string", optional: true, empty: false, min: 1 },
    ket: { type: "string", optional: true, empty: false, min: 1 },
    kehadiran: { type: "string", optional: true, empty: false, min: 1 }  // tambahkan ket jika diperlukan
  };

  const validasi = v.validate(req.body, schema);

  if (validasi.length) {
    return res.status(400).json(validasi);
  }

  try {
    // Hanya masukkan field yang ada dalam req.body ke dalam query `where`
    let whereCondition = {
      idteknisi: { [Op.ne]: idTeknisi }
    };

    if (req.body.nama) {
      whereCondition.nama = req.body.nama;
    }
    if (req.body.username) {
      whereCondition.username = req.body.username;
    }

    // Cek apakah nama atau username yang ingin diubah sudah ada di database dan bukan milik teknisi yang sedang diubah
    if (req.body.nama || req.body.username) {
      const existingTeknisi = await Teknisi.findOne({
        where: whereCondition
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

module.exports = {router,  updateKetTeknisi};
