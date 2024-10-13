const express = require('express');
const router = express.Router();
const Validator = require('fastest-validator');
const { Tiket, Pelanggan, Odp, Teknisi } = require('../models');
const { timezoneMiddleware, authMiddleware } = require('../middleware');
const { Op } = require('sequelize');
const v = new Validator();
const axios = require('axios');
const { Sequelize } = require('sequelize');

// Middleware
router.use(timezoneMiddleware);
router.use(authMiddleware({ allowAdmin: true, allowTeknisi: true }));

// Format hasil
const formatResult = (tiket) => ({
    nomortiket: tiket.nomortiket,
    nomorinternet: tiket.nomorinternet,
    keluhan: tiket.keluhan,
    tipetiket: tiket.tipetiket,
    status: tiket.status,
    idpelanggan: tiket.idpelanggan ? `${tiket.Pelanggan.idpelanggan} | ${tiket.Pelanggan.nama} | ${tiket.Pelanggan.alamat} | ${tiket.Pelanggan.nohp}` : null,
    idodp: tiket.idodp ? `${tiket.Odp.idodp}` : null,
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
                { model: Odp, attributes: ['idodp'] },
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
                { model: Odp, attributes: ['idodp'] },
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

    
    if (req.body.idteknisi !== undefined) req.body.idteknisi = Number(req.body.idteknisi);

    const schema = {
        nomortiket: 'string|optional',
        nomorinternet: 'string|optional',
        keluhan: 'string|optional',
        tipetiket: 'string|optional',
        status: 'string|optional',
        idpelanggan: 'string|optional',
        idodp: 'string|optional',
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


function prosesTiket(tiketList, teknisiList) {
    const bobot = {
        ketersediaanTeknisi: 0.38,
        tiketTeknisi: 0.31,
        totaltiketTeknisi: 0.31
    };

    tiketList.forEach(tiket => {
        // Hitung WP untuk setiap teknisi di setiap tiket
        teknisiList.forEach(teknisi => {
            const kriteriaTersedia = teknisi.ket === 'Available' ? 2 : 1;
            let kriteriaTiketTeknisi = teknisi.tiketTeknisi >= 3 ? 1 : (teknisi.tiketTeknisi === 2 ? 2 : 3);
            let kriteriaTotalTiketTeknisi = teknisi.totaltiketTeknisi >= 3 ? 1 : (teknisi.totaltiketTeknisi === 2 ? 2 : 3);

            // Hitung skor WP
            teknisi.wp = Math.pow(kriteriaTersedia, bobot.ketersediaanTeknisi) *
                         Math.pow(kriteriaTiketTeknisi, bobot.tiketTeknisi) *
                         Math.pow(kriteriaTotalTiketTeknisi, bobot.totaltiketTeknisi);
        });

        const totalWp = teknisiList.reduce((sum, teknisi) => sum + teknisi.wp, 0);
        teknisiList.forEach(teknisi => teknisi.normalizedWp = teknisi.wp / totalWp);
        teknisiList.sort((a, b) => b.normalizedWp - a.normalizedWp);

        const selectedTeknisi = teknisiList[0];

        // Jika teknisi tersedia, assign ke tiket
        if (selectedTeknisi && selectedTeknisi.tiketTeknisi < 3) {
            tiket.idteknisi = selectedTeknisi.idteknisi;
            tiket.status = 'In Progress';

            console.log(`Tiket ID ${tiket.nomortiket}:`, {
                idteknisi: tiket.idteknisi,
                status: tiket.status,
                teknisiList
            });

            selectedTeknisi.ket = 'Not Available';
            selectedTeknisi.tiketTeknisi += 1;
            selectedTeknisi.totaltiketTeknisi += 1;
        } else {
            // Jika semua teknisi penuh, biarkan tiket.idteknisi tetap undefined/null
            tiket.idteknisi = null;
        }
    });

    // Kembalikan hanya tiket yang memiliki teknisi
    return tiketList.filter(tiket => tiket.idteknisi !== null);
}


// Fungsi untuk menjalankan cron job
const postTiket = async () => {
    const apiUrl = 'https://6kh4g3z0-3030.asse.devtunnels.ms/tiket'; // URL API

    // Simulasi objek req dan res
    const req = {
        currentTime: new Date() // Atur currentTime sesuai kebutuhan
    };
    const res = {
        status: (statusCode) => ({
            json: (data) => console.log(`Response Status: ${statusCode}`, data)
        }),
    };

    try {
        // Middleware: set timezone
        await timezoneMiddleware(req, res, () => {});

        // Ambil data tiket dari API
        const response = await axios.get(apiUrl);
        const apiData = response.data;
        const dataToInsert = Array.isArray(apiData) ? apiData : [apiData];

        // Ambil nomor tiket yang sudah ada
        const existingTicketId = await Tiket.findAll({
            attributes: ['nomortiket']
        }).then(existingRecords => existingRecords.map(record => record.nomortiket));

        // Validasi data tiket
        const validData = dataToInsert.map(item => {
            const nomortiket = item.nomortiket;
            if (existingTicketId.includes(nomortiket)) {
                return { error: `Nomor Tiket '${nomortiket}' sudah ada.` };
            }
            return {
                nomortiket: item.nomortiket,
                nomorinternet: item.nomorinternet,
                keluhan: item.keluhan,
                tipetiket: item.tipetiket,
                status: item.status,
                idpelanggan: item.idpelanggan,
                idodp: item.namaodp
            };
        }).filter(item => !item.error);

        if (validData.length === 0) {
            console.log('Data Sudah Ada');
            return;
        }

        // Ambil daftar teknisi yang hadir
        const teknisiList = await Teknisi.findAll({
            where: {
                kehadiran: 'Hadir',
                ket: {
                    [Op.or]: ['Available', 'Not Available']
                }
            }
        });

        // Filter teknisi untuk mendapatkan hanya yang tidak memiliki lebih dari 2 tiket aktif jika mereka 'Not Available'
        const filteredTeknisiList = [];
        for (let teknisi of teknisiList) {
            const tiketCount = await Tiket.count({
                where: {
                    idteknisi: teknisi.idteknisi,
                    status: {
                        [Op.ne]: 'Selesai' // Status selain 'Selesai'
                    }
                }
            });
            // Hitung total semua tiket yang pernah ditangani teknisi
            teknisi.totaltiketTeknisi = await Tiket.count({
                where: {
                    idteknisi: teknisi.idteknisi
                }
            });

            // Jika teknisi tersedia, tambahkan ke daftar
            if (teknisi.ket === 'Available' || (teknisi.ket === 'Not Available' && tiketCount <= 2)) {
                teknisi.tiketTeknisi = tiketCount; // Menyimpan jumlah tiket
                filteredTeknisiList.push(teknisi);
            }
        }

        // Debug: Print filteredTeknisiList untuk melihat hasil hitung
        console.log(filteredTeknisiList);

        // Proses tiket dengan algoritma WP
        const assignedTickets = await prosesTiket(validData, filteredTeknisiList);

        // Siapkan array untuk menyimpan tiket yang valid untuk dimasukkan ke dalam database
        const ticketsToInsert = assignedTickets.filter(ticket => ticket.idteknisi);

        // Masukkan data tiket yang valid ke dalam database
        const insertedTickets = await Tiket.bulkCreate(ticketsToInsert);

        // Tambahkan waktu pembuatan dan update
        const results = insertedTickets.map(ticket => ({
            ...ticket.toJSON(),
            createdAt: req.currentTime,
            updatedAt: req.currentTime,
        }));

       // Update status teknisi yang telah dipilih
       for (let teknisi of filteredTeknisiList) {
        // Cek apakah teknisi memiliki tiket yang ditugaskan
        const tiketAssigned = assignedTickets.find(ticket => ticket.idteknisi === teknisi.idteknisi);
        // Set status teknisi menjadi 'Not Available' jika mereka memiliki tiket, jika tidak 'Available'
        const newStatus = tiketAssigned ? 'Not Available' : 'Available';

        await Teknisi.update(
            { ket: newStatus }, 
            { where: { idteknisi: teknisi.idteknisi } }
        );
    }

        if (results.length === 0){
            console.log('Tidak Ada Tiket Baru Yang Ditambahkan!');
        }
        else{
            console.log('Tiket berhasil dimasukkan:', results);
        }

    } catch (error) {
        console.error('Tidak bisa menambah data:', error.message);
    }
};


module.exports = {router, postTiket};




