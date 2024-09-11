// const express = require('express');
// const router = express.Router();
// const Validator = require('fastest-validator');
// const { Tiket, Pelanggan, Odp, Teknisi } = require('../models');
// const v = new Validator();
// const { timezoneMiddleware, authMiddleware } = require('../middleware');
// const { Op } = require('sequelize');

// // Middleware
// router.use(timezoneMiddleware);
// router.use(authMiddleware({ allowAdmin: true, allowTeknisi: true }));

// // Format hasil
// const formatResult = (tiket) => {
//     return {
//         idtiket: tiket.idtiket,
//         nomortiket: tiket.nomortiket,
//         nomorinternet: tiket.nomorinternet,
//         keluhan: tiket.keluhan, // Tambahkan keluhan di sini,
//         tipetiket: tiket.tipetiket,
//         status: tiket.status,
//         ket:tiket.ket,
//         notepelanggan: tiket.notepelanggan, // Tambahkan notepelanggan di sini
//         idpelanggan: tiket.idpelanggan ? `${tiket.Pelanggan.idpelanggan} | ${tiket.Pelanggan.nama} | ${tiket.Pelanggan.alamat} | ${tiket.Pelanggan.nohp}` : null,
//         idodp: tiket.idodp ? `${tiket.Odp.idodp} | ${tiket.Odp.namaodp}` : null,
//         idteknisi: tiket.idteknisi ? `${tiket.Teknisi.idteknisi} | ${tiket.Teknisi.nama}` : null,
//         createdAt: tiket.createdAt,
//         updatedAt: tiket.updatedAt
//     };
// };

// // // Rute GET untuk semua tiket
// // router.get('/', async (req, res) => {
// //     try {
// //         const tiketList = await Tiket.findAll({
// //             include: [
// //                 { model: Pelanggan, attributes: ['idpelanggan', 'nama', 'alamat', 'nohp'] },
// //                 { model: Odp, attributes: ['idodp', 'namaodp'] },
// //                 { model: Teknisi, attributes: ['idteknisi', 'nama'] }
// //             ]
// //         });

// //         const result = tiketList.map(tiket => {
// //             const formattedData = formatResult(tiket.toJSON());
// //             return req.convertTimestamps(formattedData);
// //         });

// //         res.json(result);
// //     } catch (error) {
// //         res.status(500).json({ message: 'Error mengambil data', error: error.message });
// //     }
// // });
// router.get('/', async (req, res) => {
//   try {
//       // Cek apakah query parameter status dan idteknisi ada
//       const queryCondition = {};
//       if (req.query.status) {
//           queryCondition.status = req.query.status;
//       }
//       if (req.query.idteknisi) {
//           queryCondition.idteknisi = req.query.idteknisi;
//       }

//       // Dapatkan tiket berdasarkan kondisi (status dan idteknisi jika ada)
//       const tiketList = await Tiket.findAll({
//           where: queryCondition,
//           include: [
//               { model: Pelanggan, attributes: ['idpelanggan', 'nama', 'alamat', 'nohp'] },
//               { model: Odp, attributes: ['idodp', 'namaodp'] },
//               { model: Teknisi, attributes: ['idteknisi', 'nama'] }
//           ]
//       });

//       const result = tiketList.map(tiket => {
//           const formattedData = formatResult(tiket.toJSON());
//           return req.convertTimestamps(formattedData);
//       });

//       // Tampilkan tiket berdasarkan kondisi yang diberikan
//       res.json(result);
//   } catch (error) {
//       res.status(500).json({ message: 'Error mengambil data', error: error.message });
//   }
// });

// // Rute GET untuk tiket berdasarkan ID
// router.get('/:idtiket', async (req, res) => {
//     try {
//         const idtiket = req.params.idtiket;
//         const tiket = await Tiket.findByPk(idtiket, {
//             include: [
//                 { model: Pelanggan, attributes: ['idpelanggan', 'nama', 'alamat', 'nohp'] },
//                 { model: Odp, attributes: ['idodp', 'namaodp'] },
//                 { model: Teknisi, attributes: ['idteknisi', 'nama'] }
//             ]
//         });

//         if (!tiket) {
//             return res.status(404).json({ message: 'Data tidak ditemukan' });
//         }

//         const formattedData = formatResult(tiket.toJSON());
//         const result = req.convertTimestamps(formattedData);

//         res.json(result);
//     } catch (error) {
//         res.status(500).json({ message: 'Error mengambil data', error: error.message });
//     }
// });

// // Menambahkan Data
// router.post('/', async (req, res) => {
//   // Konversi idodp dan idteknisi menjadi angka jika ada
//   if (req.body.idodp !== undefined) {
//     req.body.idodp = Number(req.body.idodp);
//   }
//   if (req.body.idteknisi !== undefined) {
//     req.body.idteknisi = Number(req.body.idteknisi);
//   }

//   const schema = {
//     nomortiket: 'string',
//     nomorinternet: 'string',
//     keluhan: 'string',
//     notepelanggan: 'string|optional',
//     tipetiket: 'string',
//     status: 'string',
//     ket: 'string|optional',
//     idpelanggan: 'string',
//     idodp: 'number',
//     idteknisi: 'number|optional'
//   };

//   const validate = v.validate(req.body, schema);

//   if (validate.length) {
//     return res.status(400).json(validate);
//   }

//   try {
//     // Cek apakah nomortiket sudah ada di database
//     const existingTiket = await Tiket.findOne({ where: { nomortiket: req.body.nomortiket } });
//     if (existingTiket) {
//       return res.status(400).json({ message: 'Nomor tiket sudah ada, silakan gunakan nomor tiket yang berbeda' });
//     }

//     // Jika nomortiket tidak ada, buat tiket baru
//     let tiket = await Tiket.create(req.body);
//     const result = req.convertTimestamps(tiket.toJSON());
//     res.status(201).json(result);
//   } catch (error) {
//     return res.status(500).json({ message: 'Error menambahkan data', error: error.message });
//   }
// });


// // Untuk mengedit data tiket berdasarkan ID
// router.put('/:idtiket', async (req, res) => {
//     const idtiket = req.params.idtiket;
//     let tiket = await Tiket.findByPk(idtiket);
  
//     if (!tiket) {
//       return res.status(404).json({ message: 'Data tidak ditemukan' });
//     }
  
//     // Konversi idodp dan idteknisi menjadi angka jika ada
//     if (req.body.idodp !== undefined) {
//       req.body.idodp = Number(req.body.idodp);
//     }
//     if (req.body.idteknisi !== undefined) {
//       req.body.idteknisi = Number(req.body.idteknisi);
//     }
  
//     const schema = {
//         nomortiket: 'string|optional',
//         nomorinternet: 'string|optional',
//         keluhan: 'string|optional',
//         notepelanggan: 'string|optional',
//         tipetiket: 'string|optional',
//         status: 'string|optional',
//         ket: 'string|optional',
//         idpelanggan: 'string|optional',
//         idodp: 'number|optional',
//         idteknisi: 'number|optional'
//     };
  
//     const validate = v.validate(req.body, schema);
  
//     if (validate.length) {
//       return res.status(400).json(validate);
//     }
  
//     try {
//       tiket = await tiket.update(req.body);
//       const result = req.convertTimestamps(tiket.toJSON());
//       res.json(result);
//     } catch (error) {
//       return res.status(500).json({ message: 'Error memperbarui data', error: error.message });
//     }
//   });
  
//   // Untuk menghapus data tiket berdasarkan ID
//   router.delete('/:idtiket', async (req, res) => {
//     const idtiket = req.params.idtiket;
//     try {
//       const tiket = await Tiket.findByPk(idtiket);
  
//       if (!tiket) {
//         return res.status(404).json({ message: 'Data tidak ditemukan' });
//       }
  
//       await tiket.destroy();
//       return res.json({
//         time: req.currentTime,
//         message: 'Data telah dihapus'
//       });
//     } catch (error) {
//       return res.status(500).json({ message: 'Error menghapus data', error: error.message });
//     }
//   });
  


// // Rute GET untuk tiket berdasarkan status
// router.get('/status/:status', async (req, res) => {
//     try {
//         const status = req.params.status;
//         const validStatuses = ['In Progress', 'Ditugaskan'];

//         if (!validStatuses.includes(status)) {
//             return res.status(400).json({ message: 'Status tidak valid' });
//         }

//         const tiketList = await Tiket.findAll({
//             where: { status: status },
//             include: [
//                 { model: Pelanggan, attributes: ['idpelanggan', 'nama', 'alamat', 'nohp'] },
//                 { model: Odp, attributes: ['idodp', 'namaodp'] },
//                 { model: Teknisi, attributes: ['idteknisi', 'nama'] }
//             ]
//         });

//         const result = tiketList.map(tiket => {
//             const formattedData = formatResult(tiket.toJSON());
//             return req.convertTimestamps(formattedData);
//         });

//         res.json(result);
//     } catch (error) {
//         res.status(500).json({ message: 'Error mengambil data', error: error.message });
//     }
// });


// router.get('/status', async (req, res) => {
//     try {
//         // Mengambil parameter status dari query
//         const statuses = req.query.status;
//         console.log('Query Params:', req.query); // Debug log

//         // Validasi jika status tidak ada
//         if (!statuses) {
//             return res.status(400).json({ message: 'Query parameter "status" diperlukan' });
//         }

//         // Memecah status menjadi array dan menghapus whitespace
//         const statusArray = statuses.split(',').map(status => status.trim());
//         console.log('Status Array:', statusArray); // Debug log

//         // Melakukan query ke database
//         const tiketList = await Tiket.findAll({
//             where: {
//                 status: {
//                     [Op.in]: statusArray // Menggunakan operator IN
//                 }
//             },
//             include: [
//                 { model: Pelanggan, attributes: ['idpelanggan', 'nama', 'alamat', 'nohp'] },
//                 { model: Odp, attributes: ['idodp', 'namaodp'] },
//                 { model: Teknisi, attributes: ['idteknisi', 'nama'] }
//             ]
//         });

//         // Log hasil tiketList
//         console.log('Tiket List:', tiketList); // Debug log

//         // Memeriksa apakah tiketList kosong
//         if (tiketList.length === 0) {
//             return res.status(404).json({ message: 'Data tidak ditemukan' });
//         }

//         // Mengembalikan hasil dalam format JSON
//         res.json(tiketList);
//     } catch (error) {
//         console.error('Error:', error); // Log detail error
//         res.status(500).json({ message: 'Error mengambil data', error: error.message });
//     }
// });




// // Rute GET untuk semua tiket atau berdasarkan status
// router.get('/', async (req, res) => {
//     try {
//         // Cek apakah query parameter status ada
//         const queryCondition = {};
//         if (req.query.status) {
//             queryCondition.status = req.query.status;
//         }

//         // Dapatkan tiket berdasarkan kondisi (status jika ada)
//         const tiketList = await Tiket.findAll({
//             where: queryCondition,
//             include: [
//                 { model: Pelanggan, attributes: ['idpelanggan', 'nama', 'alamat', 'nohp'] },
//                 { model: Odp, attributes: ['idodp', 'namaodp'] },
//                 { model: Teknisi, attributes: ['idteknisi', 'nama'] }
//             ]
//         });

//         const result = tiketList.map(tiket => {
//             const formattedData = formatResult(tiket.toJSON());
//             return req.convertTimestamps(formattedData);
//         });

//         // Jika query parameter status ada, tampilkan tiket berdasarkan status, jika tidak, tampilkan semua tiket
//         res.json(result);
//     } catch (error) {
//         res.status(500).json({ message: 'Error mengambil data', error: error.message });
//     }
// });



  // module.exports = router;

const express = require('express');
const router = express.Router();
const Validator = require('fastest-validator');
const { Tiket, Pelanggan, Odp, Teknisi } = require('../models');
const { timezoneMiddleware, authMiddleware } = require('../middleware');
const { Op } = require('sequelize');
const v = new Validator();

// Middleware
router.use(timezoneMiddleware);
router.use(authMiddleware({ allowAdmin: true, allowTeknisi: true }));

// Format hasil
const formatResult = (tiket) => ({
    idtiket: tiket.idtiket,
    nomortiket: tiket.nomortiket,
    nomorinternet: tiket.nomorinternet,
    keluhan: tiket.keluhan,
    tipetiket: tiket.tipetiket,
    status: tiket.status,
    ket: tiket.ket,
    notepelanggan: tiket.notepelanggan,
    idpelanggan: tiket.idpelanggan ? `${tiket.Pelanggan.idpelanggan} | ${tiket.Pelanggan.nama} | ${tiket.Pelanggan.alamat} | ${tiket.Pelanggan.nohp}` : null,
    idodp: tiket.idodp ? `${tiket.Odp.idodp} | ${tiket.Odp.namaodp}` : null,
    idteknisi: tiket.idteknisi ? `${tiket.Teknisi.idteknisi} | ${tiket.Teknisi.nama}` : null,
    createdAt: tiket.createdAt,
    updatedAt: tiket.updatedAt
});

// Rute GET untuk semua tiket
router.get('/', async (req, res) => {
    try {
        const queryCondition = {};
        if (req.query.status) queryCondition.status = req.query.status;
        if (req.query.idteknisi) queryCondition.idteknisi = req.query.idteknisi;

        const tiketList = await Tiket.findAll({
            where: queryCondition,
            include: [
                { model: Pelanggan, attributes: ['idpelanggan', 'nama', 'alamat', 'nohp'] },
                { model: Odp, attributes: ['idodp', 'namaodp'] },
                { model: Teknisi, attributes: ['idteknisi', 'nama'] }
            ]
        });

        const result = tiketList.map(tiket => req.convertTimestamps(formatResult(tiket.toJSON())));
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error mengambil data', error: error.message });
    }
});

// Rute GET untuk tiket berdasarkan ID
router.get('/:idtiket', async (req, res) => {
    try {
        const tiket = await Tiket.findByPk(req.params.idtiket, {
            include: [
                { model: Pelanggan, attributes: ['idpelanggan', 'nama', 'alamat', 'nohp'] },
                { model: Odp, attributes: ['idodp', 'namaodp'] },
                { model: Teknisi, attributes: ['idteknisi', 'nama'] }
            ]
        });

        if (!tiket) return res.status(404).json({ message: 'Data tidak ditemukan' });

        const result = req.convertTimestamps(formatResult(tiket.toJSON()));
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error mengambil data', error: error.message });
    }
});

// Menambahkan Data
router.post('/', async (req, res) => {
    if (req.body.idodp !== undefined) req.body.idodp = Number(req.body.idodp);
    if (req.body.idteknisi !== undefined) req.body.idteknisi = Number(req.body.idteknisi);

    const schema = {
        nomortiket: 'string',
        nomorinternet: 'string',
        keluhan: 'string',
        notepelanggan: 'string|optional',
        tipetiket: 'string',
        status: 'string',
        ket: 'string|optional',
        idpelanggan: 'string',
        idodp: 'number',
        idteknisi: 'number|optional'
    };

    const validate = v.validate(req.body, schema);
    if (validate.length) return res.status(400).json(validate);

    try {
        const existingTiket = await Tiket.findOne({ where: { nomortiket: req.body.nomortiket } });
        if (existingTiket) return res.status(400).json({ message: 'Nomor tiket sudah ada, silakan gunakan nomor tiket yang berbeda' });

        const tiket = await Tiket.create(req.body);
        const result = req.convertTimestamps(tiket.toJSON());
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error menambahkan data', error: error.message });
    }
});

// Mengedit data tiket berdasarkan ID
router.put('/:idtiket', async (req, res) => {
    let tiket = await Tiket.findByPk(req.params.idtiket);
    if (!tiket) return res.status(404).json({ message: 'Data tidak ditemukan' });

    if (req.body.idodp !== undefined) req.body.idodp = Number(req.body.idodp);
    if (req.body.idteknisi !== undefined) req.body.idteknisi = Number(req.body.idteknisi);

    const schema = {
        nomortiket: 'string|optional',
        nomorinternet: 'string|optional',
        keluhan: 'string|optional',
        notepelanggan: 'string|optional',
        tipetiket: 'string|optional',
        status: 'string|optional',
        ket: 'string|optional',
        idpelanggan: 'string|optional',
        idodp: 'number|optional',
        idteknisi: 'number|optional'
    };

    const validate = v.validate(req.body, schema);
    if (validate.length) return res.status(400).json(validate);

    try {
        tiket = await tiket.update(req.body);
        const result = req.convertTimestamps(tiket.toJSON());
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error memperbarui data', error: error.message });
    }
});

// Menghapus data tiket berdasarkan ID
router.delete('/:idtiket', async (req, res) => {
    try {
        const tiket = await Tiket.findByPk(req.params.idtiket);
        if (!tiket) return res.status(404).json({ message: 'Data tidak ditemukan' });

        await tiket.destroy();
        res.json({ time: req.currentTime, message: 'Data telah dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Error menghapus data', error: error.message });
    }
});

// Rute GET untuk tiket berdasarkan status
router.get('/status/:status', async (req, res) => {
    try {
        const validStatuses = ['In Progress', 'Ditugaskan'];
        if (!validStatuses.includes(req.params.status)) return res.status(400).json({ message: 'Status tidak valid' });

        const tiketList = await Tiket.findAll({
            where: { status: req.params.status },
            include: [
                { model: Pelanggan, attributes: ['idpelanggan', 'nama', 'alamat', 'nohp'] },
                { model: Odp, attributes: ['idodp', 'namaodp'] },
                { model: Teknisi, attributes: ['idteknisi', 'nama'] }
            ]
        });

        const result = tiketList.map(tiket => req.convertTimestamps(formatResult(tiket.toJSON())));
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error mengambil data', error: error.message });
    }
});

module.exports = router;

  

