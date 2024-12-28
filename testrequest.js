const crypto = require('crypto');
const axios = require('axios');

// This would be kept secure on the origin server
const privateKey = '...'; // Your private key here

async function fetchContent(fileId) {
    const timestamp = new Date().toISOString();
    const origin = 'example.com';
    const path = `/content/${fileId}`;
    
    const dataToSign = `${origin}:${timestamp}:${path}`;
    
    const signer = crypto.createSign('SHA256');
    signer.update(dataToSign);
    const signature = signer.sign(privateKey, 'base64');
    
    try {
        const response = await axios.get(`http://localhost:3000${path}`, {
            headers: {
                'Origin': origin,
                'X-Request-Signature': signature,
                'X-Request-Timestamp': timestamp
            }
        });
        console.log(response.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

fetchContent('test1');