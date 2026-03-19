/**
 * ScottyMd — getSender
 * Extracts correct sender JID from any message type
 * © ScottyMd by Scotty
 */
function normalizeJid(jid) {
    if (!jid) return '';
    const c = String(jid).replace(/:\d+@/, '@');
    if (c.includes('@')) return c.toLowerCase().trim();
    return c.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
}

function getSender(sock, message) {
    try {
        const isGroup = message.key?.remoteJid?.endsWith('@g.us');
        let raw;
        if (message.key.fromMe) {
            raw = sock.user?.id || '';
        } else if (isGroup) {
            raw = message.key.participant
                || message.message?.extendedTextMessage?.contextInfo?.participant
                || message.key.remoteJid;
        } else {
            raw = message.key.remoteJid;
        }
        return normalizeJid(raw);
    } catch { return ''; }
}

function getBotJid(sock) {
    return normalizeJid(sock.user?.id || '');
}

module.exports = { getSender, getBotJid, normalizeJid };
