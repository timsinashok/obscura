// src/routes/contentRoutes.js
const express = require('express');
const router = express.Router();
const verifyOrigin = require('../middleware/originVerifier');
const contentController = require('../controllers/contentController');
const fileDeliver = require('../controllers/fileDeliver');

router.get('/:fileId', verifyOrigin, contentController.deliverContent);
router.get('/files/list', fileDeliver.listFiles);

module.exports = router;