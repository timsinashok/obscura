const crypto = require('crypto');
const axios = require('axios');
const fs = require('fs');

// Read the private key
const privateKey = fs.readFileSync('src/private-key.pem', 'utf8');

async function testRequest() {
    const timestamp = new Date().toISOString();
    const origin = 'example.com';
    const path = '/content/test1';
    
    // Create signature
    const dataToSign = `${origin}:${timestamp}:${path}`;
    console.log('Data being signed:', dataToSign);
    const signer = crypto.createSign('SHA256');
    signer.update(dataToSign);
    const signature = signer.sign(privateKey, 'base64');
    
    try {
        const response = await axios.get(`http://localhost:3001${path}`, {
            headers: {
                'Origin': origin,
                'X-Request-Signature': signature,
                'X-Request-Timestamp': timestamp
            }
        });
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

testRequest();