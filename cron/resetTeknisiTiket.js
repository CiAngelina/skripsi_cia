// const cron = require('node-cron');
// const { Teknisi } = require('../models'); // Import model Teknisi

// // Atur cron job untuk berjalan setiap hari pada pukul 7 pagi dan berhenti pada pukul 5 sore
// cron.schedule('0 7 * * *', async () => {
//     try {
//         // Reset totaltiketTeknisi menjadi 0 untuk semua teknisi setiap hari pada pukul 7 pagi
//         await Teknisi.update({ totaltiketTeknisi: 0 }, { where: {} });
//         console.log('Total tiket teknisi berhasil di-reset pada pukul 7 pagi.');
//     } catch (error) {
//         console.error('Gagal mereset total tiket teknisi:', error);
//     }
// }, {
//     timezone: 'Asia/Jakarta'
// });

// // Menjalankan cron job untuk berhenti pada pukul 5 sore
// cron.schedule('0 17 * * *', () => {
//     console.log('Cron job dihentikan pada pukul 5 sore.');
//     process.exit(0); // Menghentikan proses cron
// }, {
//     timezone: 'Asia/Jakarta'
// });


// const cron = require('node-cron');
// const { Teknisi } = require('../models'); // Import model Teknisi

// // Atur cron job untuk berjalan setiap hari pada pukul 7 pagi
// cron.schedule('0 7 * * *', async () => {
//     try {
//         // Reset totaltiketTeknisi menjadi 0 untuk semua teknisi setiap hari pada pukul 7 pagi
//         await Teknisi.update({ totaltiketTeknisi: 0 }, { where: {} });
//         console.log('Total tiket teknisi berhasil di-reset pada pukul 7 pagi.');
//     } catch (error) {
//         console.error('Gagal mereset total tiket teknisi:', error);
//     }
// }, {
//     timezone: 'Asia/Jakarta'
// });


const cron = require('node-cron');
const { Teknisi, Tiket } = require('../models'); // Import model Teknisi dan Tiket

// Fungsi untuk menghitung WP dan memperbarui data tiket
async function calculateWP() {
    try {
        const tiketBelumSelesai = await Tiket.findAll({
            where: { wpStatus: 'In Progress' } // Hanya tiket yang aktif
        });

        for (const tiket of tiketBelumSelesai) {
            const wpScore = calculateWPForTiket(tiket); // Implementasikan fungsi perhitungan WP
            await tiket.update({ wpScore });
        }

        console.log('WP berhasil dihitung dan diperbarui.');
    } catch (error) {
        console.error('Gagal menghitung WP:', error);
    }
}

function calculateWPForTiket(tiket) {
    return Math.random() * 10; // Contoh skor WP acak
}

// Cron job untuk reset total tiket teknisi setiap hari pada pukul 7 pagi
cron.schedule('0 7 * * *', async () => {
    try {
        await Teknisi.update({ totaltiketTeknisi: 0 }, { where: {} });
        console.log('Total tiket teknisi berhasil di-reset pada pukul 7 pagi.');
    } catch (error) {
        console.error('Gagal mereset total tiket teknisi:', error);
    }
}, {
    timezone: 'Asia/Jakarta'
});

// Cron job untuk menghitung WP dan reset total tiket teknisi pada pukul 5 sore
cron.schedule('0 17 * * *', async () => {
    try {
        await calculateWP();
        await Teknisi.update({ totaltiketTeknisi: 0 }, { where: {} });
        console.log('Cron job dijalankan: WP dihitung dan total tiket teknisi di-reset.');
    } catch (error) {
        console.error('Gagal menjalankan cron job:', error);
    }
}, {
    timezone: 'Asia/Jakarta'
});
// Reset dilihat status nyaa dulu, kalo misalkan ada yang belum selesai pada hari ini, namun dikerjakan besok, ditunggu 
// Sampai selesaii, agar reset data aman.
// Mengubah status otomatis not ke ava