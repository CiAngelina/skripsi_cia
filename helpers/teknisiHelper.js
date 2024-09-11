function prosesTiket(tiketList, teknisiList) {
    const bobot = {
        tersedia: 0.4,
        odpSektor: 0.3,
        keahlian: 0.2,
        tipeTiket: 0.1
    };

    tiketList.forEach(tiket => {
        teknisiList.forEach(teknisi => {
            const kriteriaTersedia = teknisi.tersedia ? 1 : 0;
            const kriteriaOdpSektor = (teknisi.odp === tiket.idodp && teknisi.sektor === tiket.sektor) ? 1 : 0;
            const kriteriaKeahlian = tiket.keahlian.length > 0 ? teknisi.keahlian.filter(k => tiket.keahlian.includes(k)).length / tiket.keahlian.length : 0;
            const kriteriaTipeTiket = tiket.tipetiket === 'GOLD' ? 1 : 0.5;

            teknisi.wp = Math.pow(kriteriaTersedia, bobot.tersedia) *
                         Math.pow(kriteriaOdpSektor, bobot.odpSektor) *
                         Math.pow(kriteriaKeahlian, bobot.keahlian) *
                         Math.pow(kriteriaTipeTiket, bobot.tipeTiket);
        });

        // Mengurutkan teknisi berdasarkan skor WP secara menurun
        teknisiList.sort((a, b) => b.wp - a.wp);

        // Menetapkan teknisi dengan skor tertinggi ke tiket
        tiket.idteknisi = teknisiList.length > 0 ? teknisiList[0].idteknisi : null;
    });
}

module.exports = { prosesTiket };


// BARU

// function prosesTiket(tiketList, teknisiList) {
//     const bobot = {
//         ketersediaanTeknisi: 0.55,
//         jumlahTiket: 0.45
//     };

//     tiketList.forEach(tiket => {
//         // Hitung skor WP untuk setiap teknisi
//         teknisiList.forEach(teknisi => {
//             const kriteriaTersedia = teknisi.ket ? 2 : 1;
            
//             // Menentukan nilai kriteria jumlah tiket
//             let kriteriaJumlahTiket;
//             if (teknisi.jumlahTiket >= 3) {
//                 kriteriaJumlahTiket = 1;
//             } else if (teknisi.jumlahTiket === 2) {
//                 kriteriaJumlahTiket = 2;
//             } else if (teknisi.jumlahTiket === 1) {
//                 kriteriaJumlahTiket = 3;
//             } else {
//                 kriteriaJumlahTiket = 0;
//             }

//             // Menghitung nilai Vector S untuk setiap teknisi
//             teknisi.wp = Math.pow(kriteriaTersedia, bobot.ketersediaanTeknisi) *
//                          Math.pow(kriteriaJumlahTiket, bobot.jumlahTiket);
//         });

//         // Menghitung total semua skor Vector S untuk normalisasi
//         const totalWp = teknisiList.reduce((sum, teknisi) => sum + teknisi.wp, 0);

//         // Menambahkan skor normalisasi ke setiap teknisi Vector V
//         teknisiList.forEach(teknisi => {
//             teknisi.normalizedWp = teknisi.wp / totalWp;
//         });

//         // (Opsional) Mengurutkan teknisi berdasarkan skor Vector V 
//         teknisiList.sort((a, b) => b.normalizedWp - a.normalizedWp);

//         // Menetapkan teknisi dengan nilai WP tertinggi ke tiket saat ini
//         tiket.idTeknisi = teknisiList[0].idTeknisi;


//     });
// }

// Ini Lebih Baru
// function prosesTiket(tiketList, teknisiList) {
//     const bobot = {
//         ketersediaanTeknisi: 0.38, 
//         tiketTeknisi: 0.31,
//         totaltiketTeknisi: 0.31
//     };

//     tiketList.forEach(tiket => {
//         // Hitung skor WP untuk setiap teknisi
//         teknisiList.forEach(teknisi => {
//             // Kriteria ketersediaan teknisi (2 jika tersedia, 1 jika tidak)
//             const kriteriaTersedia = teknisi.ket ? 2 : 1;

//             // Menentukan nilai kriteria tiket teknisi
//             let kriteriaTiketTeknisi;
//             if (teknisi.tiketTeknisi >= 3) {
//                 kriteriaTiketTeknisi = 1;
//             } else if (teknisi.tiketTeknisi === 2) {
//                 kriteriaTiketTeknisi = 2;
//             } else if (teknisi.tiketTeknisi === 1) {
//                 kriteriaTiketTeknisi = 3;
//             } else {
//                 kriteriaTiketTeknisi = 0; // Nilai default jika teknisi tidak menangani tiket
//             }

//             // Menentukan nilai kriteria total tiket teknisi
//             let kriteriaTotalTiketTeknisi;
//             if (teknisi.totaltiketTeknisi >= 3) {
//                 kriteriaTotalTiketTeknisi = 1;
//             } else if (teknisi.totaltiketTeknisi === 2) {
//                 kriteriaTotalTiketTeknisi = 2;
//             } else if (teknisi.totaltiketTeknisi === 1) {
//                 kriteriaTotalTiketTeknisi = 3;
//             } else {
//                 kriteriaTotalTiketTeknisi = 0; // Nilai default jika teknisi tidak menangani tiket
//             }

//             // Menghitung nilai Vector S (skor WP) untuk setiap teknisi
//             teknisi.wp = Math.pow(kriteriaTersedia, bobot.ketersediaanTeknisi) *
//                          Math.pow(kriteriaTiketTeknisi, bobot.tiketTeknisi) *
//                          Math.pow(kriteriaTotalTiketTeknisi, bobot.totaltiketTeknisi); // bobot yang benar
//         });

//         // Menghitung total semua skor Vector S untuk normalisasi
//         const totalWp = teknisiList.reduce((sum, teknisi) => sum + teknisi.wp, 0);

//         // Menambahkan skor normalisasi ke setiap teknisi (Vector V)
//         teknisiList.forEach(teknisi => {
//             teknisi.normalizedWp = teknisi.wp / totalWp;
//         });

//         // Mengurutkan teknisi berdasarkan skor Vector V 
//         teknisiList.sort((a, b) => b.normalizedWp - a.normalizedWp);

//         // Menetapkan teknisi dengan nilai WP tertinggi ke tiket saat ini
//         tiket.idTeknisi = teknisiList[0].idTeknisi;
//     });
// }
