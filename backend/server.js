const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
// Allow CORS from one or more frontend origins.
// Set FRONTEND_URLS as a comma-separated list (e.g. http://localhost:3000,http://localhost:9002)
const defaultOrigins = ['http://localhost:3000', 'http://localhost:9002'];
const frontendUrlsEnv = process.env.FRONTEND_URLS || process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_API_URL;
const allowedOrigins = frontendUrlsEnv ? frontendUrlsEnv.split(',').map(s => s.trim()) : defaultOrigins;

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: origin not allowed'));
    }
  },
  credentials: true
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/recommendations', require('./routes/recommendations'));

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));