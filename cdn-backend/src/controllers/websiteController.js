const fs = require('fs').promises;
const path = require('path');
const keyManager = require('../services/keyManager');

const WEBSITES_FILE = path.join(__dirname, '../config/websites.json');

async function ensureWebsitesFile() {
    try {
        await fs.access(WEBSITES_FILE);
    } catch {
        await fs.writeFile(WEBSITES_FILE, JSON.stringify({ websites: [] }));
    }
}

async function getWebsites(req, res) {
    try {
        await ensureWebsitesFile();
        const data = await fs.readFile(WEBSITES_FILE, 'utf8');
        const { websites } = JSON.parse(data);
        res.json(websites);
    } catch (error) {
        console.error('Error getting websites:', error);
        res.status(500).json({ error: 'Failed to get websites' });
    }
}

async function addWebsite(req, res) {
    try {
        const { domain } = req.body;
        if (!domain) {
            return res.status(400).json({ error: 'Domain is required' });
        }

        await ensureWebsitesFile();
        const data = await fs.readFile(WEBSITES_FILE, 'utf8');
        const { websites } = JSON.parse(data);

        if (websites.some(site => site.domain === domain)) {
            return res.status(400).json({ error: 'Website already exists' });
        }

        const newWebsite = {
            id: Date.now().toString(),
            domain,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        websites.push(newWebsite);
        await fs.writeFile(WEBSITES_FILE, JSON.stringify({ websites }, null, 2));

        res.status(201).json(newWebsite);
    } catch (error) {
        console.error('Error adding website:', error);
        res.status(500).json({ error: 'Failed to add website' });
    }
}

async function removeWebsite(req, res) {
    try {
        const { id } = req.params;
        await ensureWebsitesFile();
        const data = await fs.readFile(WEBSITES_FILE, 'utf8');
        const { websites } = JSON.parse(data);

        const updatedWebsites = websites.filter(site => site.id !== id);
        await fs.writeFile(WEBSITES_FILE, JSON.stringify({ websites: updatedWebsites }, null, 2));

        res.json({ message: 'Website removed successfully' });
    } catch (error) {
        console.error('Error removing website:', error);
        res.status(500).json({ error: 'Failed to remove website' });
    }
}

module.exports = {
    getWebsites,
    addWebsite,
    removeWebsite
}; 