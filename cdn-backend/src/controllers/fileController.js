const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');

const UPLOADS_DIR = path.join(__dirname, '../../uploads');
const FILES_DB = path.join(__dirname, '../config/files.json');

// Ensure directories and files exist
async function ensureDirectories() {
    try {
        await fs.access(UPLOADS_DIR);
    } catch {
        await fs.mkdir(UPLOADS_DIR, { recursive: true });
    }

    try {
        await fs.access(FILES_DB);
    } catch {
        await fs.writeFile(FILES_DB, JSON.stringify({ files: [] }));
    }
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        await ensureDirectories();
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = crypto.randomBytes(16).toString('hex');
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

const upload = multer({ 
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    }
}).single('file');

async function uploadFile(req, res) {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const fileData = {
                id: crypto.randomBytes(16).toString('hex'),
                name: req.file.originalname,
                filename: req.file.filename,
                size: req.file.size,
                type: req.file.mimetype,
                websiteId: req.body.websiteId,
                uploadDate: new Date().toISOString(),
                path: req.file.path
            };

            const data = JSON.parse(await fs.readFile(FILES_DB, 'utf8'));
            data.files.push(fileData);
            await fs.writeFile(FILES_DB, JSON.stringify(data, null, 2));

            res.status(201).json({
                id: fileData.id,
                name: fileData.name,
                size: fileData.size,
                type: fileData.type,
                uploadDate: fileData.uploadDate,
                websiteId: fileData.websiteId
            });
        } catch (error) {
            console.error('Error saving file data:', error);
            res.status(500).json({ error: 'Failed to process upload' });
        }
    });
}

async function listFiles(req, res) {
    try {
        await ensureDirectories();
        const data = JSON.parse(await fs.readFile(FILES_DB, 'utf8'));
        
        // Filter by websiteId if provided
        const { websiteId } = req.query;
        let files = data.files;
        if (websiteId) {
            files = files.filter(file => file.websiteId === websiteId);
        }

        res.json(files.map(file => ({
            id: file.id,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadDate: file.uploadDate,
            websiteId: file.websiteId
        })));
    } catch (error) {
        console.error('Error listing files:', error);
        res.status(500).json({ error: 'Failed to list files' });
    }
}

async function deleteFile(req, res) {
    try {
        const { id } = req.params;
        const data = JSON.parse(await fs.readFile(FILES_DB, 'utf8'));
        const fileIndex = data.files.findIndex(file => file.id === id);

        if (fileIndex === -1) {
            return res.status(404).json({ error: 'File not found' });
        }

        const file = data.files[fileIndex];
        await fs.unlink(file.path);
        
        data.files.splice(fileIndex, 1);
        await fs.writeFile(FILES_DB, JSON.stringify(data, null, 2));

        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ error: 'Failed to delete file' });
    }
}

module.exports = {
    uploadFile,
    listFiles,
    deleteFile
}; 