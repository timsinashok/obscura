const fs = require('fs');

// Read the public key
const publicKey = fs.readFileSync('public-key.pem', 'utf8');

// Create authorized origins config
const config = {
    authorizedOrigins: [
        {
            domain: "example.com",
            publicKey: publicKey
        }
    ]
};

// Save to config file
fs.writeFileSync('src/config/authorized-origins.json', JSON.stringify(config, null, 2));