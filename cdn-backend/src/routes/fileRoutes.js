const express = require('express');
const router = express.Router();
const fileDeliver = require('../controllers/fileDeliver');

router.get('/list', fileDeliver.listFiles);

module.exports = router;