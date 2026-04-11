const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { analyzeResume } = require('../controllers/resumeController');

// When a POST request hits /analyze, first run the 'upload' middleware, then run the 'analyzeResume' controller
router.post('/analyze', upload.single('resume'), analyzeResume);

module.exports = router;