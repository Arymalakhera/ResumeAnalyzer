const multer = require('multer');
const path = require('path');

// Configure where and how the files are stored temporarily
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files to the uploads folder
    },
    filename: (req, file, cb) => {
        // Create a unique filename to prevent overwriting
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Filter to only accept PDF and DOCX files
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.pdf' || ext === '.docx') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF and DOCX files are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = upload;