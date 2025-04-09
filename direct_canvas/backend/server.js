const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());

const SECRET_KEY = crypto.createHash('sha256').update("").digest(); // 256-bit key
const validLinks = new Map(); // Store valid links

// Function to encrypt data
function encryptData(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', SECRET_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return `${iv.toString('base64')}.${encrypted}`;
}

// Function to decrypt data
function decryptData(encryptedData) {
    try {
        const [ivBase64, encryptedBase64] = encryptedData.split('.');
        const iv = Buffer.from(ivBase64, 'base64');
        const encrypted = Buffer.from(encryptedBase64, 'base64');

        const decipher = crypto.createDecipheriv('aes-256-cbc', SECRET_KEY, iv);
        let decrypted = decipher.update(encrypted, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
}

// Function to generate a secure link
function generateSecureLink(content) {
    const linkID = crypto.randomBytes(16).toString('hex');
    const encryptedContent = encryptData(content);

    validLinks.set(linkID, { encryptedContent, createdAt: Date.now() });

    return `http://localhost:3001/viewer/${linkID}`;
}





// Route to generate a secure link
app.get('/api/get-secure-link', (req, res) => {
    // Multi-line content
    const multiLineText = `one moment you are so happy`;
    
    const link = generateSecureLink(multiLineText);
    res.json({ link });
});

// Route to serve decrypted content
app.get('/viewer/:linkID', (req, res) => {
    const linkID = req.params.linkID;

    if (!validLinks.has(linkID)) {
        return res.status(403).send("<h1>Link Expired or Invalid</h1>");
    }

    const { encryptedContent } = validLinks.get(linkID);
    validLinks.delete(linkID); // Self-destructing link

    const decryptedText = decryptData(encryptedContent);

    if (!decryptedText) {
        return res.status(500).send("<h1>Decryption Error</h1>");
    }

    res.send(`<html><body><canvas id="secureCanvas"></canvas><script>
        const canvas = document.getElementById('secureCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 600;
        canvas.height = 300;
        ctx.font = '20px Arial';
        ctx.fillText('${decryptedText}', 50, 150);
    </script></body></html>`);
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
