const fs = require('fs');
const { reply, getSender } = require('./_helper');
const isOwner = require('../lib/isOwner');
module.exports = async (sock, chatId, message) => {
    const sender = getSender(sock, message);
    if (!isOwner(sender)) return reply(sock, chatId, '❌ Owner only.', message);
    const f = './data/session_backup.b64';
    if (!fs.existsSync(f)) return reply(sock, chatId, '❌ No session backup yet. Will be created after connection.', message);
    const data = fs.readFileSync(f, 'utf8');
    await reply(sock, chatId, `🔐 *SESSION_ID*\n\nSave this as SESSION_ID env variable on Koyeb to skip re-pairing on restart.`, message);
    await sock.sendMessage(chatId, { document: Buffer.from(data), fileName: 'SESSION_ID.txt', mimetype: 'text/plain', caption: '📎 Copy all content → Set as SESSION_ID env variable' });
};
