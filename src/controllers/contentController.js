// src/controllers/contentController.js
const fs = require('fs').promises;
const path = require('path');

async function deliverContent(req, res) {
    try {
        const { fileId } = req.params;
        const filePath = path.join(__dirname, '../../content', `${fileId}.txt`);
        
        const content = await fs.readFile(filePath, 'utf8');
        
        // Send content with appropriate headers
        res.set('Content-Type', 'text/plain');
        res.set('Cache-Control', 'no-store');
        res.send(content);
    } catch (error) {
        console.error('Error delivering content:', error);
        res.status(404).json({ error: 'Content not found' });
    }
}

module.exports = {
    deliverContent
};