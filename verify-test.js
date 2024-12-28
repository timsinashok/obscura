const crypto = require('crypto');
const fs = require('fs');

// Read keys
const privateKey = fs.readFileSync('private-key.pem', 'utf8');
const publicKey = fs.readFileSync('public-key.pem', 'utf8');

// Test data
const testData = 'example.com:2024-01-01T00:00:00.000Z:/content/test1';

// Create signature
const signer = crypto.createSign('SHA256');
signer.update(testData);
const signature = signer.sign(privateKey, 'base64');

// Verify signature
const verifier = crypto.createVerify('SHA256');
verifier.update(testData);
const isValid = verifier.verify(publicKey, signature, 'base64');

console.log('Test Verification Result:', isValid);
console.log('Test Data:', testData);
console.log('Signature:', signature);