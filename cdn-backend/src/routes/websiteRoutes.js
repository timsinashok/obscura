const express = require('express');
const router = express.Router();
const websiteController = require('../controllers/websiteController');

router.get('/', websiteController.getWebsites);
router.post('/', websiteController.addWebsite);
router.delete('/:id', websiteController.removeWebsite);

module.exports = router; 