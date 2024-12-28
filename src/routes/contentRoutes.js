// src/routes/contentRoutes.js
const express = require('express');
const router = express.Router();
const verifyOrigin = require('../middleware/originVerifier');
const contentController = require('../controllers/contentController');

router.get('/:fileId', verifyOrigin, contentController.deliverContent);

module.exports = router;