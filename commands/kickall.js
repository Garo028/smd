const { reply, getSender } = require('./_helper');
const { isBotAdmin } = require('../lib/isAdmin');
const isOwner = require('../lib/isOwner');
module.exports = async (sock, chatId, message) => {
    if (!chatId.endsWith('@g.us')) return reply(sock, chatId, '❌ Groups only.', message);
    const sender = getSender(sock, message);
    if (!isOwner(sender)) return reply(sock, chatId, '❌ Owner only — dangerous command!', message);
    if (!await isBotAdmin(sock, chatId)) return reply(sock, chatId, '❌ Make me admin first.', message);
    const meta = await sock.groupMetadata(chatId);
    const members = meta.participants.filter(p=>!p.admin).map(p=>p.id);
    if (!members.length) return reply(sock, chatId, '✅ No regular members to kick.', message);
    await reply(sock, chatId, `⚠️ Kicking ${members.length} members...`, message);
    for (const m of members) { try { await sock.groupParticipantsUpdate(chatId,[m],'remove'); await new Promise(r=>setTimeout(r,500)); } catch {} }
    await reply(sock, chatId, `✅ Kicked ${members.length} members.\n\n_© ScottyMd by Scotty_`, message);
};
