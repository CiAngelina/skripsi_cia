// helpers/idGenerator.js
// const generateIdTeknisi = () => {
//     const timestamp = Date.now(); // Menggunakan timestamp sebagai bagian dari ID
//     const randomNum = Math.floor(Math.random() * 5); // Angka acak
//     return `TK-${timestamp}-${randomNum}`; // Format ID
//   };


  
//   module.exports = generateIdTeknisi
const generateIdTeknisi = () => {
  const randomNum = Math.floor(10000 + Math.random() * 90000); // Angka acak 5 digit
  return `TK-${randomNum}`; // Format ID yang lebih pendek
};

module.exports = generateIdTeknisi;
