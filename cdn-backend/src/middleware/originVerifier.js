const keyManager = require('../services/keyManager');

async function verifyOriginMiddleware(req, res, next) {
    const origin = req.get('Origin');
    const signature = req.get('X-Request-Signature');
    const timestamp = req.get('X-Request-Timestamp');

    if (!origin || !signature || !timestamp) {
        return res.status(401).json({ error: 'Missing required headers' });
    }

    // Prevent replay attacks by checking timestamp
    const requestTime = new Date(timestamp).getTime();
    const currentTime = Date.now();
    if (currentTime - requestTime > 300000) { // 5 minutes window
        return res.status(401).json({ error: 'Request expired' });
    }

    // Data to verify
    const dataToVerify = `${origin}:${timestamp}:/content${req.path}`;
    console.log('Data to verify:', dataToVerify);
    
    const isValid = keyManager.verifyOrigin(origin, signature, dataToVerify);
    if (!isValid) {
        return res.status(403).json({ error: 'Invalid origin signature' });
    }

    next();
}

module.exports = verifyOriginMiddleware;


