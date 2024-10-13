const express = require('express');
const router = express.Router();
const { Odp} = require('../models');
const Validator = require('fastest-validator');
const { timezoneMiddleware, authMiddleware } = require('../middleware');
const axios = require('axios');
const { Sequelize } = require('sequelize');


const v = new Validator();

// Middleware untuk pengaturan timezone
router.use(timezoneMiddleware);

// Middleware untuk memastikan hanya admin yang dapat mengakses rute ini
router.use(authMiddleware({ allowAdmin: true, allowTeknisi: false }));

// Helper function untuk format data ODP
const formatResult = (odp) => ({
  idodp: odp.idodp,
  createdAt: odp.createdAt,
  updatedAt: odp.updatedAt
});

// Rute GET untuk melihat semua data ODP
router.get('/', async (req, res) => {
  try {
    const odpList = await Odp.findAll({
      
    });

    const result = odpList.map(odp => req.convertTimestamps(formatResult(odp.toJSON())));

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Error mengambil data', error: error.message });
  }
});


router.get('/:idodp', async (req, res) => {
  try {
    // Decode the idodp parameter to handle encoded characters
    const { idodp } = req.params;
    const decodedIdOdp = decodeURIComponent(idodp); // Decode the ID

    const odp = await Odp.findByPk(decodedIdOdp, {
      // Your query options here if any
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



// async function postOdp(currentTime) {
//   const apiUrl = 'https://6kh4g3z0-3030.asse.devtunnels.ms/tiket'; // Ganti dengan URL API yang sesuai
//   const req = {
//     currentTime: new Date() // Atur currentTime sesuai dengan kebutuhan
//   };
//   const res = {
//     status: (statusCode) => ({
//       json: (data) => console.log(`Response Status: ${statusCode}`, data)
//     }),
//   };

//   try {
//     // Middleware: set timezone
//     await timezoneMiddleware(req, res, () => {});

//     const response = await axios.get(apiUrl);
//     const apiData = response.data;

//     // Pastikan data dari API adalah array
//     const dataToInsert = Array.isArray(apiData) ? apiData : [apiData];

//     // Array untuk menampung namaodp yang sudah ada
//     const existingOdpNames = await Odp.findAll({
//       attributes: ['idodp']
//     }).then(existingRecords => existingRecords.map(record => record.idodp));

//     // Validasi dan persiapkan data untuk dimasukkan
//     const validData = dataToInsert
//       .filter(item => !existingOdpNames.includes(item.namaodp)) // Hanya data baru
//       .map(item => ({
//         idodp: item.namaodp // Gunakan currentTime dari request
//       }));

//       if (validData.length === 0) {
//         // Semua data sudah ada
//         console.log('Semua Data Sudah Ada. Tidak Ada Data Baru Yang Ditambahkan!');
//       } else {
//         // Masukkan data yang valid ke dalam database
//         const insertedOdp = await Odp.bulkCreate(validData);
//         const results = insertedOdp.map(odp => ({
//           ...odp.toJSON(),
//           createdAt: req.currentTime,
//           updatedAt: req.currentTime
//         }));

//       // Tampilkan data yang berhasil dimasukkan
//       console.log('Data Odp Telah Ditambahkan', results);
//     }
//   } catch (error) {
//     console.log('Error menambahkan Odp:', error);
//   }
// }

async function postOdp(currentTime) {
  const apiUrl = 'https://6kh4g3z0-3030.asse.devtunnels.ms/tiket'; // Ganti dengan URL API yang sesuai
  const req = {
    currentTime: new Date() // Atur currentTime sesuai dengan kebutuhan
  };
  const res = {
    status: (statusCode) => ({
      json: (data) => console.log(`Response Status: ${statusCode}`, data)
    }),
  };

  try {
    // Middleware: set timezone
    await timezoneMiddleware(req, res, () => {});

    // Ambil data dari API
    const response = await axios.get(apiUrl);
    const apiData = response.data;

    // Pastikan data dari API adalah array
    const dataToInsert = Array.isArray(apiData) ? apiData : [apiData];

    // Array untuk menampung namaodp yang sudah ada di database
    const existingOdpNames = await Odp.findAll({
      attributes: ['idodp']
    }).then(existingRecords => existingRecords.map(record => record.idodp));

    // Validasi dan persiapkan data yang belum ada di database
    const validData = dataToInsert
      .filter(item => !existingOdpNames.includes(item.namaodp)) // Hanya data baru
      .map(item => ({
        idodp: item.namaodp,
        createdAt: req.currentTime,  // Set waktu pembuatan
        updatedAt: req.currentTime   // Set waktu pembaruan
      }));

    if (validData.length === 0) {
      // Jika semua data sudah ada
      console.log('Semua Data Sudah Ada. Tidak Ada Data Baru Yang Ditambahkan!');
    } else {
      // Masukkan data yang valid ke dalam database dengan mengabaikan duplikat
      const insertedOdp = await Odp.bulkCreate(validData, {
        ignoreDuplicates: true // Mengabaikan data duplikat
      });

      // Memetakan hasil bulkCreate untuk mencetak hasil
      const results = insertedOdp.map(odp => odp.toJSON());

      // Tampilkan hasil data yang berhasil ditambahkan
      console.log('Data ODP Baru Telah Ditambahkan!', results);
    }
  } catch (error) {
    console.error('Error menambahkan ODP:', error.message);
  }
}



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




module.exports = {router, postOdp};