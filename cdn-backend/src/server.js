const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const keyManager = require('./services/keyManager');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

// Initialize key manager
keyManager.loadAuthorizedOrigins().then(() => {
    console.log('Key manager initialized');
}).catch(err => {
    console.error('Failed to initialize key manager:', err);
});

// Routes
const contentRoutes = require('./routes/contentRoutes');
const fileRoutes = require('./routes/fileRoutes');
const websiteRoutes = require('./routes/websiteRoutes');

app.use('/content', contentRoutes);
app.use('/files', fileRoutes);
app.use('/websites', websiteRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});