const fs = require('fs').promises;
const path = require('path');

async function listFiles(req, res) {
    try {
        const directoryPath = path.join(__dirname, '../../content');

        // Read the contents of the directory
        const files = await fs.readdir(directoryPath);

        // Send the list of file names as a response
        res.json(files);
    } catch (error) {
        console.error('Error listing files:', error);
        res.status(500).json({ error: 'Failed to list files' });
    }
}

module.exports = {
    listFiles
};