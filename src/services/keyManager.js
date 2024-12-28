// // src/services/keyManager.js
// const crypto = require('crypto');
// const fs = require('fs').promises;
// const path = require('path');

// class KeyManager {
//     constructor() {
//         this.authorizedOrigins = new Map();
//     }

//     // Load authorized origins and their public keys
//     async loadAuthorizedOrigins() {
//         try {
//             // In production, this would come from a database
//             // For now, we'll use a simple JSON file
//             const origins = await fs.readFile(path.join(__dirname, '../config/authorized-origins.json'), 'utf8');
//             const originsData = JSON.parse(origins);
            
//             originsData.forEach(origin => {
//                 this.authorizedOrigins.set(origin.domain, origin.publicKey);
//             });
//         } catch (error) {
//             console.error('Error loading authorized origins:', error);
//             throw error;
//         }
//     }

//     verifyOrigin(domain, signature, data) {
//         const publicKey = this.authorizedOrigins.get(domain);
//         if (!publicKey) {
//             return false;
//         }

//         try {
//             const verifier = crypto.createVerify('SHA256');
//             verifier.update(data);
//             return verifier.verify(publicKey, signature, 'base64');
//         } catch (error) {
//             console.error('Verification error:', error);
//             return false;
//         }
//     }
// }

// module.exports = new KeyManager();


const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

class KeyManager {
    constructor() {
        this.authorizedOrigins = new Map();
    }

    async loadAuthorizedOrigins() {
        try {
            const origins = await fs.readFile(path.join(__dirname, '../config/authorized-origins.json'), 'utf8');
            const originsData = JSON.parse(origins);
            
            // Fix: Access the authorizedOrigins array from the parsed data
            originsData.authorizedOrigins.forEach(origin => {
                this.authorizedOrigins.set(origin.domain, origin.publicKey);
            });
            
            console.log('Loaded authorized origins:', Array.from(this.authorizedOrigins.keys()));
        } catch (error) {
            console.error('Error loading authorized origins:', error);
            throw error;
        }
    }

    verifyOrigin(domain, signature, data) {
        const publicKey = this.authorizedOrigins.get(domain);
        if (!publicKey) {
            console.log('No public key found for domain:', domain);
            return false;
        }

        console.log('Loaded public key for', domain, ':', this.authorizedOrigins.get(domain));
        try {
            const verifier = crypto.createVerify('SHA256');
            verifier.update(data);
            console.log('Data:', data);
            const result = verifier.verify(publicKey, signature, 'base64');
            console.log('Verification result for domain:', domain, 'Result:', result);
            return result;
        } catch (error) {
            console.error('Verification error:', error);
            return false;
        }
    }
}

module.exports = new KeyManager();