const { checkAdmin, reply, getSender } = require('./_helper');
const isOwner = require('../lib/isOwner');
module.exports = async (sock, chatId, message) => {
    const sender = getSender(sock, message);
    const isGroup = chatId.endsWith('@g.us');
    if (!isOwner(sender) && !(isGroup && await checkAdmin(sock, chatId, message))) return reply(sock, chatId, '❌ Admins only.', message);
    const ctx = message.message?.extendedTextMessage?.contextInfo;
    if (!ctx?.stanzaId) return reply(sock, chatId, '❌ Reply to the message you want to delete.', message);
    try {
        await sock.sendMessage(chatId, { delete: { remoteJid:chatId, fromMe: ctx.participant===(sock.user.id.split(':')[0]+'@s.whatsapp.net'), id:ctx.stanzaId, participant:ctx.participant } });
    } catch { await reply(sock, chatId, '❌ Could not delete that message.', message); }
};
