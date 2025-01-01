const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const keyManager = require('./services/keyManager');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
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
app.use('/content', contentRoutes);

const fileRoutes = require('./routes/fileRoutes');
app.use('/files', fileRoutes);

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