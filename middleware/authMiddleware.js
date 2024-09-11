// const jwt = require('jsonwebtoken');

// const authMiddleware = (roles = []) => {
//   return (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, 'your_secret_key', (err, decoded) => {
//       if (err) {
//         return res.status(401).json({ message: 'Invalid token' });
//       }

//       req.user = decoded;

//       if (roles.length && !roles.includes(decoded.role)) {
//         return res.status(403).json({ message: 'Forbidden' });
//       }

//       next();
//     });
//   };
// };

// module.exports = authMiddleware;
// const jwt = require('jsonwebtoken');

// const authMiddleware = (roles = []) => {
//   return (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, 'your_secret_key', (err, decoded) => {
//       if (err) {
//         return res.status(401).json({ message: 'Invalid token' });
//       }

//       req.user = decoded;

//       if (roles.length && !roles.includes(decoded.role)) {
//         return res.status(403).json({ message: 'Forbidden' });
//       }

//       next();
//     });
//   };
// };

// module.exports = authMiddleware;

// const jwt = require('jsonwebtoken');

// // Fungsi middleware untuk memverifikasi token dan hak akses
// const authMiddleware = (roles = []) => {
//   return (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, 'your_secret_key', (err, decoded) => {
//       if (err) {
//         return res.status(401).json({ message: 'Invalid token' });
//       }

//       req.user = decoded;

//       if (roles.length && !roles.includes(decoded.role)) {
//         return res.status(403).json({ message: 'Forbidden' });
//       }

//       next();
//     });
//   };
// };

// module.exports = authMiddleware;

// const jwt = require('jsonwebtoken');

// const authMiddleware = (roles = []) => {
//   return (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, 'your_secret_key', (err, decoded) => {
//       if (err) {
//         return res.status(401).json({ message: 'Invalid token' });
//       }

//       req.user = decoded; // Simpan informasi pengguna dalam req.user
//       console.log('Decoded user:', req.user); // Log untuk debug

//       // Periksa apakah role dari pengguna sesuai dengan yang diperlukan
//       if (roles.length && !roles.includes(decoded.role)) {
//         return res.status(403).json({ message: 'Forbidden' });
//       }

//       next();
//     });
//   };
// };

// module.exports = authMiddleware;
// const jwt = require('jsonwebtoken');

// const authMiddleware = (roles = []) => {
//   return (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, 'your_secret_key', (err, decoded) => {
//       if (err) {
//         console.error('JWT Error:', err);
//         return res.status(401).json({ message: 'Invalid token' });
//       }

//       req.user = decoded; // Simpan informasi pengguna dalam req.user
//       console.log('Decoded user:', req.user); // Log untuk debug

//       // Periksa apakah role dari pengguna sesuai dengan yang diperlukan
//       if (roles.length && !roles.includes(decoded.role)) {
//         console.error('Forbidden: User role does not match');
//         return res.status(403).json({ message: 'Forbidden' });
//       }

//       next();
//     });
//   };
// };

// module.exports = authMiddleware;

// kjdjjdj

// const jwt = require('jsonwebtoken');

// const authMiddleware = () => {
//   return (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, 'your_secret_key', (err, decoded) => {
//       if (err) {
//         console.error('JWT Error:', err);
//         return res.status(401).json({ message: 'Invalid token' });
//       }

//       req.user = decoded; // Simpan informasi pengguna dalam req.user
//       console.log('Decoded user:', req.user); // Log untuk debug

     

//       next();
//     });
//   };
// };

// module.exports = authMiddleware;


// const jwt = require('jsonwebtoken');
// const { Admin, Teknisi } = require('../models'); // Import model sesuai kebutuhan

// const authMiddleware = (roles = []) => {
//   return async (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, 'your_secret_key', async (err, decoded) => {
//       if (err) {
//         console.error('JWT Error:', err);
//         return res.status(401).json({ message: 'Invalid token' });
//       }

//       req.user = decoded; // Simpan informasi pengguna dalam req.user
//       console.log('Decoded user:', req.user); // Log untuk debug

//       // Menentukan tabel dari mana pengguna berasal
//       let user;
//       if (decoded.table === 'admin') {
//         user = await Admin.findByPk(decoded.id);
//       } else if (decoded.table === 'teknisi') {
//         user = await Teknisi.findByPk(decoded.id);
//       }

//       if (!user) {
//         return res.status(401).json({ message: 'User not found' });
//       }

//       // Periksa apakah role dari pengguna sesuai dengan yang diperlukan
//       const userRole = decoded.table; // Misalnya, 'admin' atau 'teknisi'
//       if (roles.length && !roles.includes(userRole)) {
//         console.error('Forbidden: User role does not match');
//         return res.status(403).json({ message: 'Forbidden' });
//       }

//       next();
//     });
//   };
// };

// module.exports = authMiddleware;

// ini baru
// const jwt = require('jsonwebtoken');
// const { Admin, Teknisi } = require('../models');

// const authMiddleware = ({ allowAdmin = true, allowTeknisi = false }) => {
//   return async (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, 'your_secret_key', async (err, decoded) => {
//       if (err) {
//         console.error('JWT Error:', err);
//         return res.status(401).json({ message: 'Invalid token' });
//       }

//       req.user = decoded;
//       console.log('Decoded user:', req.user);

//       try {
//         // Periksa apakah pengguna berasal dari tabel Admin
//         const isAdmin = await Admin.findOne({ where: { username: req.user.username } });
//         const isTeknisi = await Teknisi.findOne({ where: { username: req.user.username } });

//         if (isAdmin && allowAdmin) {
//           req.user.role = 'admin';
//           return next(); // Beri akses jika admin diizinkan
//         }

//         if (isTeknisi && allowTeknisi) {
//           req.user.role = 'teknisi';
//           return next(); // Beri akses jika teknisi diizinkan
//         }

//         // Jika pengguna tidak ditemukan di tabel Admin atau Teknisi, atau tidak diizinkan
//         return res.status(403).json({ message: 'Forbidden' });
//       } catch (error) {
//         console.error('Error during user check:', error);
//         return res.status(500).json({ message: 'Internal Server Error' });
//       }
//     });
//   };
// };

// module.exports = authMiddleware;

const jwt = require('jsonwebtoken');
const { Admin, Teknisi } = require('../models');

const authMiddleware = ({ allowAdmin = true, allowTeknisi = false }) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, 'your_secret_key', async (err, decoded) => {
      if (err) {
        console.error('JWT Error:', err);
        return res.status(401).json({ message: 'Invalid token' });
      }

      req.user = decoded;
      console.log('Decoded user:', req.user);

      try {
        // Periksa apakah pengguna berasal dari tabel Admin
        const isAdmin = await Admin.findOne({ where: { username: req.user.username } });
        const isTeknisi = await Teknisi.findOne({ where: { username: req.user.username } });

        if (isAdmin && allowAdmin) {
          return next(); // Beri akses jika admin diizinkan
        }

        if (isTeknisi && allowTeknisi) {
          return next(); // Beri akses jika teknisi diizinkan
        }

        // Jika pengguna tidak ditemukan di tabel Admin atau Teknisi, atau tidak diizinkan
        return res.status(403).json({ message: 'Forbidden' });
      } catch (error) {
        console.error('Error during user check:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    });
  };
};

module.exports = authMiddleware;

// const jwt = require('jsonwebtoken');
// const { Admin, Teknisi } = require('../models');

// const authMiddleware = ({ allowAdmin = true, allowTeknisi = false }) => {
//   return async (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, 'your_secret_key', async (err, decoded) => {
//       if (err) {
//         console.error('JWT Error:', err);
//         return res.status(401).json({ message: 'Invalid token' });
//       }

//       req.user = decoded;
//       console.log('Decoded user:', req.user);

//       try {
//         // Periksa apakah pengguna berasal dari tabel Admin
//         const isAdmin = await Admin.findOne({ where: { username: req.user.username } });
//         const isTeknisi = await Teknisi.findOne({ where: { username: req.user.username } });

//         if (isAdmin && allowAdmin) {
//           return next(); // Beri akses jika admin diizinkan
//         }

//         if (isTeknisi && allowTeknisi) {
//           return next(); // Beri akses jika teknisi diizinkan
//         }

//         // Jika pengguna tidak ditemukan di tabel Admin atau Teknisi, atau tidak diizinkan
//         return res.status(403).json({ message: 'Forbidden' });
//       } catch (error) {
//         console.error('Error during user check:', error);
//         return res.status(500).json({ message: 'Internal Server Error' });
//       }
//     });
//   };
// };

// module.exports = authMiddleware;
