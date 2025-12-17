const multer = require('multer');
const path = require('path');

// Configure multer for Id uploads
const Idstorage = multer.memoryStorage();

const Idupload = multer({
    storage: Idstorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf/;

        const extname = allowedTypes.test(
            path.extname(file.originalname).toLowerCase()
        );

        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        }

        cb(new Error('Only images and PDFs are allowed'));
    }
});


// Configure multer for profile photos
const Profilestorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/profiles/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const Profileupload = multer({
    storage: Profilestorage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed'));
    }
});



module.exports = {
    Idupload,
    Profileupload
}
