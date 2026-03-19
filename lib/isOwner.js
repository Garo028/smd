/**
 * ScottyMd — isOwner
 * Compares by number only — immune to JID format issues
 * © ScottyMd by Scotty
 */
const fs       = require('fs');
const settings = require('../settings');

function num(val) {
    if (!val) return '';
    return String(val).replace(/:\d+@.*$/, '').replace(/@.*$/, '').replace(/[^0-9]/g, '');
}

function isOwner(userId) {
    if (!userId) return false;
    const u = num(userId);
    if (!u) return false;
    if (u === num(settings.ownerNumber)) return true;
    if (process.env.OWNER_NUMBER && u === num(process.env.OWNER_NUMBER)) return true;
    try {
        const f = './data/owner.json';
        if (fs.existsSync(f)) {
            const list = JSON.parse(fs.readFileSync(f, 'utf8'));
            if (Array.isArray(list)) return list.some(o => num(o) === u);
        }
    } catch {}
    return false;
}

module.exports = isOwner;
module.exports.isOwner = isOwner;
module.exports.num     = num;
