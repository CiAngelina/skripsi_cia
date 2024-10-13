const express = require('express');
const router = express.Router();
const { Pelanggan } = require('../models');
const Validator = require('fastest-validator');
const { timezoneMiddleware, authMiddleware } = require('../middleware');
const axios = require('axios');
const { Sequelize } = require('sequelize');


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


// async function postPelanggan() {
//   const apiUrl = 'https://6kh4g3z0-3030.asse.devtunnels.ms/tiket';
  
//   // Simulasi objek req dan res
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

//     const dataToInsert = Array.isArray(apiData) ? apiData : [apiData];

//     const existingCustomerIds = await Pelanggan.findAll({
//       attributes: ['idpelanggan']
//     }).then(existingRecords => existingRecords.map(record => record.idpelanggan));

//     const validData = dataToInsert
//       .filter(item => !existingCustomerIds.includes(item.idpelanggan))
//       .map(item => ({
//         idpelanggan: item.idpelanggan,
//         nama: item.namapelanggan,
//         nohp: item.nohp,
//         alamat: item.alamat
//       }));

//     if (validData.length === 0) {
//       console.log('Semua Data Sudah Ada. Tidak Ada Data Baru Yang Ditambahkan! ');
//     } else {
//       const insertedCustomers = await Pelanggan.bulkCreate(validData);
//       const results = insertedCustomers.map(customer => ({
//         ...customer.toJSON(),
//         createdAt: req.currentTime,
//         updatedAt: req.currentTime
//       }));

//       console.log('Data Baru Pelanggan Telah Ditambahkan!', results);
//     }
//   } catch (error) {
//     console.log('Error menambah pelanggan:', error);
//   }
// }
async function postPelanggan() {
  const apiUrl = 'https://6kh4g3z0-3030.asse.devtunnels.ms/tiket';
  
  // Simulasi objek req dan res
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

    // Ambil idpelanggan yang sudah ada di database
    const existingCustomerIds = await Pelanggan.findAll({
      attributes: ['idpelanggan']
    }).then(existingRecords => existingRecords.map(record => record.idpelanggan));

    // Filter dan persiapkan data yang belum ada di database
    const validData = dataToInsert
      .filter(item => !existingCustomerIds.includes(item.idpelanggan)) // Hanya data baru
      .map(item => ({
        idpelanggan: item.idpelanggan,
        nama: item.namapelanggan,
        nohp: item.nohp,
        alamat: item.alamat,
        createdAt: req.currentTime, // Tambahkan waktu pembuatan
        updatedAt: req.currentTime  // Tambahkan waktu pembaruan
      }));

    if (validData.length === 0) {
      // Jika semua data sudah ada
      console.log('Semua Data Sudah Ada. Tidak Ada Data Baru Yang Ditambahkan!');
    } else {
      // Masukkan data yang valid ke dalam database dengan mengabaikan duplikat
      const insertedCustomers = await Pelanggan.bulkCreate(validData, { 
        ignoreDuplicates: true  // Mengabaikan data duplikat
      });

      // Memetakan hasil bulkCreate untuk mencetak hasil
      const results = insertedCustomers.map(customer => customer.toJSON());

      // Tampilkan hasil data yang berhasil dimasukkan
      console.log('Data Baru Pelanggan Telah Ditambahkan!', results);
    }
  } catch (error) {
    console.error('Error menambah pelanggan:', error.message);
  }
}


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

module.exports = {router,  postPelanggan};
