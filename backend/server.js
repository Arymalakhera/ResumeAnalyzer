const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Connect our Routes
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// A simple test route
app.get('/api/health', (req, res) => {
    res.json({ message: 'AI Resume Analyzer API is running smoothly!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});