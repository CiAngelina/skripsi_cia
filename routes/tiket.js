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


router.get('/', async (req, res) => {
    try {
        const queryCondition = {};
        if (req.query.status) queryCondition.status = req.query.status;
        if (req.query.idteknisi) queryCondition.idteknisi = req.query.idteknisi;
        if (req.query.idpelanggan) queryCondition.idpelanggan = req.query.idpelanggan;

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


router.put('/:id/status', authMiddleware, async (req, res) => {
    try {
        const tiket = await Tiket.findOne({ where: { id: req.params.id } });

        if (!tiket) {
            return res.status(404).json({ message: 'Tiket tidak ditemukan' });
        }

        // Pastikan teknisi yang ingin mengubah status adalah teknisi yang ditugaskan ke tiket
        if (req.user.id !== tiket.idteknisi) {
            return res.status(403).json({ message: 'Anda tidak diizinkan untuk mengubah status tiket ini' });
        }

        // Ubah status tiket menjadi selesai
        tiket.status = 'selesai';
        await tiket.save();

        res.status(200).json({ message: 'Status tiket berhasil diubah menjadi selesai', tiket });
    } catch (error) {
        res.status(500).json({ message: 'Error mengubah status tiket', error: error.message });
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


function prosesTiket(tiketList, teknisiList) {
    const bobot = {
        ketersediaanTeknisi: 0.38,
        tiketTeknisi: 0.31,
        totaltiketTeknisi: 0.31
    };

    tiketList.forEach(tiket => {
        teknisiList.forEach(teknisi => {
            // Perhitungan WP biasa
            // Ketersediaan teknisi
            const kriteriaTersedia = teknisi.ket === 'available' ? 2 : 1;

            // Tiket teknisi (dihitung berdasarkan jumlah tiket yang sedang dikerjakan)
            let kriteriaTiketTeknisi;
            if (teknisi.tiketTeknisi >= 3) {
                kriteriaTiketTeknisi = 1;
            } else if (teknisi.tiketTeknisi === 2) {
                kriteriaTiketTeknisi = 2;
            } else {
                kriteriaTiketTeknisi = 3; // Untuk 0 atau 1 tiket
            }

            // Total tiket teknisi (jumlah keseluruhan tiket yang pernah dikerjakan)
            let kriteriaTotalTiketTeknisi;
            if (teknisi.totaltiketTeknisi >= 3) {
                kriteriaTotalTiketTeknisi = 1;
            } else if (teknisi.totaltiketTeknisi === 2) {
                kriteriaTotalTiketTeknisi = 2;
            } else {
                kriteriaTotalTiketTeknisi = 3;
            }

            // Menghitung Vector S (skor WP)
            teknisi.wp = Math.pow(kriteriaTersedia, bobot.ketersediaanTeknisi) *
                         Math.pow(kriteriaTiketTeknisi, bobot.tiketTeknisi) *
                         Math.pow(kriteriaTotalTiketTeknisi, bobot.totaltiketTeknisi);
        });

        // Hitung total WP untuk normalisasi
        const totalWp = teknisiList.reduce((sum, teknisi) => sum + teknisi.wp, 0);

        // Normalisasi WP
        teknisiList.forEach(teknisi => {
            teknisi.normalizedWp = teknisi.wp / totalWp;
        });

        // Pilih teknisi dengan skor WP tertinggi
        teknisiList.sort((a, b) => b.normalizedWp - a.normalizedWp);
        const selectedTeknisi = teknisiList[0];

        // Tetapkan teknisi yang dipilih ke tiket dan ubah status menjadi "In Progress"
        tiket.idteknisi = selectedTeknisi.idteknisi;
        tiket.status = 'In progress'; // Ubah status tiket menjadi "In Progress"

        // Debugging log
        console.log(`Tiket ID ${tiket.nomortiket}:`, {
            idteknisi: tiket.idteknisi,
            status: tiket.status,
            teknisiList
        });
    });
}

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

        // Cari semua teknisi yang tersedia
        const teknisiList = await Teknisi.findAll({
            where: {
                ket: 'available' // Filter teknisi yang tersedia
            }
        });

        // Looping untuk menghitung jumlah tiket teknisi dan total tiket teknisi
        for (let teknisi of teknisiList) {
            // Hitung jumlah tiket teknisi yang sedang ditangani (belum selesai)
            teknisi.tiketTeknisi = await Tiket.count({
                where: {
                    idteknisi: teknisi.idteknisi,
                    status: {
                        [Op.ne]: 'selesai' // Status selain 'selesai'
                    }
                }
            });

            // Hitung total semua tiket yang pernah ditangani teknisi
            teknisi.totaltiketTeknisi = await Tiket.count({
                where: {
                    idteknisi: teknisi.idteknisi
                }
            });
        }

        // Proses tiket dengan teknisiList yang telah dilengkapi dengan tiketTeknisi dan totaltiketTeknisi
        prosesTiket([req.body], teknisiList);

        // Buat tiket baru
        const tiket = await Tiket.create(req.body);
        const result = req.convertTimestamps(tiket.toJSON());
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error menambahkan data', error: error.message });
    }
});


module.exports = router;

// const express = require('express');
// const router = express.Router();
// const Validator = require('fastest-validator');
// const { Tiket, Pelanggan, Odp, Teknisi } = require('../models');
// const { timezoneMiddleware, authMiddleware } = require('../middleware');
// const { Op } = require('sequelize');
// const v = new Validator();

// // Middleware
// router.use(timezoneMiddleware);
// router.use(authMiddleware({ allowAdmin: true, allowTeknisi: true }));

// // Format hasil
// const formatResult = (tiket) => ({
//     idtiket: tiket.idtiket,
//     nomortiket: tiket.nomortiket,
//     nomorinternet: tiket.nomorinternet,
//     keluhan: tiket.keluhan,
//     tipetiket: tiket.tipetiket,
//     status: tiket.status,
//     ket: tiket.ket,
//     notepelanggan: tiket.notepelanggan,
//     idpelanggan: tiket.idpelanggan ? `${tiket.Pelanggan.idpelanggan} | ${tiket.Pelanggan.nama} | ${tiket.Pelanggan.alamat} | ${tiket.Pelanggan.nohp}` : null,
//     idodp: tiket.idodp ? `${tiket.Odp.idodp} | ${tiket.Odp.namaodp}` : null,
//     idteknisi: tiket.idteknisi ? `${tiket.Teknisi.idteknisi} | ${tiket.Teknisi.nama}` : null,
//     createdAt: tiket.createdAt,
//     updatedAt: tiket.updatedAt
// });

// // Rute GET untuk mengambil semua tiket
// router.get('/', async (req, res) => {
//     try {
//         const queryCondition = {};
//         if (req.query.status) queryCondition.status = req.query.status;
//         if (req.query.idteknisi) queryCondition.idteknisi = req.query.idteknisi;
//         if (req.query.idpelanggan) queryCondition.idpelanggan = req.query.idpelanggan;

//         const tiketList = await Tiket.findAll({
//             where: queryCondition,
//             include: [
//                 { model: Pelanggan, attributes: ['idpelanggan', 'nama', 'alamat', 'nohp'] },
//                 { model: Odp, attributes: ['idodp', 'namaodp'] },
//                 { model: Teknisi, attributes: ['idteknisi', 'nama'] }
//             ]
//         });

//         const result = tiketList.map(tiket => req.convertTimestamps(formatResult(tiket.toJSON())));
//         res.json(result);
//     } catch (error) {
//         res.status(500).json({ message: 'Error mengambil data', error: error.message });
//     }
// });

// // Rute GET untuk tiket berdasarkan ID
// router.get('/:idtiket', async (req, res) => {
//     try {
//         const tiket = await Tiket.findByPk(req.params.idtiket, {
//             include: [
//                 { model: Pelanggan, attributes: ['idpelanggan', 'nama', 'alamat', 'nohp'] },
//                 { model: Odp, attributes: ['idodp', 'namaodp'] },
//                 { model: Teknisi, attributes: ['idteknisi', 'nama'] }
//             ]
//         });

//         if (!tiket) return res.status(404).json({ message: 'Data tidak ditemukan' });

//         const result = req.convertTimestamps(formatResult(tiket.toJSON()));
//         res.json(result);
//     } catch (error) {
//         res.status(500).json({ message: 'Error mengambil data', error: error.message });
//     }
// });

// // Rute PUT untuk mengubah status tiket
// router.put('/:id/status', authMiddleware, async (req, res) => {
//     try {
//         const tiket = await Tiket.findOne({ where: { id: req.params.id } });

//         if (!tiket) {
//             return res.status(404).json({ message: 'Tiket tidak ditemukan' });
//         }

//         // Pastikan teknisi yang ingin mengubah status adalah teknisi yang ditugaskan ke tiket
//         if (req.user.id !== tiket.idteknisi) {
//             return res.status(403).json({ message: 'Anda tidak diizinkan untuk mengubah status tiket ini' });
//         }

//         // Ubah status tiket menjadi selesai
//         tiket.status = 'selesai';
//         await tiket.save();

//         res.status(200).json({ message: 'Status tiket berhasil diubah menjadi selesai', tiket });
//     } catch (error) {
//         res.status(500).json({ message: 'Error mengubah status tiket', error: error.message });
//     }
// });

// // Mengedit data tiket berdasarkan ID
// router.put('/:idtiket', async (req, res) => {
//     let tiket = await Tiket.findByPk(req.params.idtiket);
//     if (!tiket) return res.status(404).json({ message: 'Data tidak ditemukan' });

//     if (req.body.idodp !== undefined) req.body.idodp = Number(req.body.idodp);
//     if (req.body.idteknisi !== undefined) req.body.idteknisi = Number(req.body.idteknisi);

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
//     if (validate.length) return res.status(400).json(validate);

//     try {
//         tiket = await tiket.update(req.body);
//         const result = req.convertTimestamps(tiket.toJSON());
//         res.json(result);
//     } catch (error) {
//         res.status(500).json({ message: 'Error memperbarui data', error: error.message });
//     }
// });

// // Menghapus data tiket berdasarkan ID
// router.delete('/:idtiket', async (req, res) => {
//     try {
//         const tiket = await Tiket.findByPk(req.params.idtiket);
//         if (!tiket) return res.status(404).json({ message: 'Data tidak ditemukan' });

//         await tiket.destroy();
//         res.json({ time: req.currentTime, message: 'Data telah dihapus' });
//     } catch (error) {
//         res.status(500).json({ message: 'Error menghapus data', error: error.message });
//     }
// });

// // Fungsi untuk proses teknisi
// function prosesTiket(tiketList, teknisiList) {
//     const bobot = {
//         ketersediaanTeknisi: 0.38,
//         tiketTeknisi: 0.31,
//         totaltiketTeknisi: 0.31
//     };

//     tiketList.forEach(tiket => {
//         teknisiList.forEach(teknisi => {
//             // Perhitungan WP biasa
//             const kriteriaTersedia = teknisi.ket === 'available' ? 2 : 1;

//             // Tiket teknisi (dihitung berdasarkan jumlah tiket yang sedang dikerjakan)
//             let kriteriaTiketTeknisi;
//             if (teknisi.tiketTeknisi >= 3) {
//                 kriteriaTiketTeknisi = 1;
//             } else if (teknisi.tiketTeknisi === 2) {
//                 kriteriaTiketTeknisi = 2;
//             } else {
//                 kriteriaTiketTeknisi = 3; // Untuk 0 atau 1 tiket
//             }

//             // Total tiket teknisi (jumlah keseluruhan tiket yang pernah dikerjakan)
//             let kriteriaTotalTiketTeknisi;
//             if (teknisi.totaltiketTeknisi >= 3) {
//                 kriteriaTotalTiketTeknisi = 1;
//             } else if (teknisi.totaltiketTeknisi === 2) {
//                 kriteriaTotalTiketTeknisi = 2;
//             } else {
//                 kriteriaTotalTiketTeknisi = 3;
//             }

//             // Menghitung Vector S (skor WP)
//             teknisi.wp = Math.pow(kriteriaTersedia, bobot.ketersediaanTeknisi) *
//                          Math.pow(kriteriaTiketTeknisi, bobot.tiketTeknisi) *
//                          Math.pow(kriteriaTotalTiketTeknisi, bobot.totaltiketTeknisi);
//         });

//         // Hitung total WP untuk normalisasi
//         const totalWp = teknisiList.reduce((sum, teknisi) => sum + teknisi.wp, 0);

//         // Normalisasi WP
//         teknisiList.forEach(teknisi => {
//             teknisi.normalizedWp = teknisi.wp / totalWp;
//         });

//         // Pilih teknisi dengan skor WP tertinggi
//         teknisiList.sort((a, b) => b.normalizedWp - a.normalizedWp);
//         const selectedTeknisi = teknisiList[0];

//         // Tetapkan teknisi yang dipilih ke tiket dan ubah status menjadi "In Progress"
//         tiket.idteknisi = selectedTeknisi.idteknisi;
//         tiket.status = 'In progress'; // Ubah status tiket menjadi "In Progress"
//     });
// }

// // Rute POST untuk menambahkan tiket baru
// router.post('/', async (req, res) => {
//     if (req.body.idodp !== undefined) req.body.idodp = Number(req.body.idodp);
//     if (req.body.idteknisi !== undefined) req.body.idteknisi = Number(req.body.idteknisi);

//     const schema = {
//         nomortiket: 'string|empty:false',
//         nomorinternet: 'string|empty:false',
//         keluhan: 'string|empty:false',
//         notepelanggan: 'string|optional',
//         tipetiket: 'string|empty:false',
//         status: 'string|optional',
//         ket: 'string|optional',
//         idpelanggan: 'string|empty:false',
//         idodp: 'number|optional',
//         // idteknisi: 'number|optional'
//     };

//     const validate = v.validate(req.body, schema);
//     if (validate.length) return res.status(400).json(validate);

//     try {
//         const tiket = await Tiket.create(req.body);
//         const result = req.convertTimestamps(tiket.toJSON());
//         res.json(result);
//     } catch (error) {
//         res.status(500).json({ message: 'Error menambahkan data', error: error.message });
//     }
// });

// module.exports = router;

