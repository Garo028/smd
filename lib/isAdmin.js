/**
 * ScottyMd — isAdmin
 * Compares by number only — works with ALL JID formats
 * © ScottyMd by Scotty
 */
const cache = new Map();
const TTL   = 5000;

function num(val) {
    if (!val) return '';
    return String(val).replace(/:\d+@.*$/, '').replace(/@.*$/, '').replace(/[^0-9]/g, '');
}

function normalizeJid(jid) {
    if (!jid) return '';
    const c = String(jid).replace(/:\d+@/, '@');
    if (c.includes('@')) return c.toLowerCase().trim();
    return c.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
}

async function getMeta(sock, gid) {
    const c = cache.get(gid);
    if (c && Date.now() - c.ts < TTL) return c.data;
    const data = await sock.groupMetadata(gid);
    cache.set(gid, { data, ts: Date.now() });
    return data;
}

async function isAdmin(sock, gid, uid) {
    try {
        if (!sock || !gid || !uid) return false;
        const n = num(uid);
        if (!n) return false;
        const meta = await getMeta(sock, gid);
        return meta.participants.some(p => p.admin && num(p.id) === n);
    } catch { return false; }
}

async function isBotAdmin(sock, gid) {
    try { return await isAdmin(sock, gid, sock.user?.id || ''); }
    catch { return false; }
}

async function getAdmins(sock, gid) {
    try {
        const meta = await getMeta(sock, gid);
        return meta.participants.filter(p => p.admin).map(p => normalizeJid(p.id));
    } catch { return []; }
}

module.exports = isAdmin;
module.exports.isAdmin      = isAdmin;
module.exports.isBotAdmin   = isBotAdmin;
module.exports.getAdmins    = getAdmins;
module.exports.normalizeJid = normalizeJid;
module.exports.num          = num;
