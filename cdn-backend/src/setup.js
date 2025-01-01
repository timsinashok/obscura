const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Generate new key pair
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    }
});

// Ensure the config directory exists
const configDir = path.join(__dirname, 'config');
if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
}

// Save keys
fs.writeFileSync('private-key.pem', privateKey);
fs.writeFileSync('public-key.pem', publicKey);

// Create and save authorized origins config
const config = {
    authorizedOrigins: [
        {
            domain: "example.com",
            publicKey: publicKey
        }
    ]
};

fs.writeFileSync(
    path.join(__dirname, 'config', 'authorized-origins.json'), 
    JSON.stringify(config, null, 2)
);

// Create test content
const contentDir = path.join(__dirname, 'content');
if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
}
fs.writeFileSync(path.join(contentDir, 'test1.txt'), 'This is test content');

console.log('Setup completed successfully!');