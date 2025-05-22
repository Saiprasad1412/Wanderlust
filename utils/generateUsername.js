const crypto = require('crypto');

function generateRandomUsername(name) {
    const randomSuffix = crypto.randomBytes(3).toString('hex');
    const baseName = name ? name.replace(/\s+/g, '').toLowerCase() : 'user';
    return `${baseName}_${randomSuffix}`;
}

module.exports = generateRandomUsername;
