const { checkAdmin, reply } = require('./_helper');
module.exports = async (sock, chatId, message, args) => {
    if (!chatId.endsWith('@g.us')) return reply(sock, chatId, '❌ Groups only.', message);
    if (!await checkAdmin(sock, chatId, message)) return reply(sock, chatId, '❌ Admins only.', message);
    const meta = await sock.groupMetadata(chatId);
    const mentions = meta.participants.map(p => p.id);
    await sock.sendMessage(chatId, { text: args.join(' ') || '📢', mentions }, { quoted: message });
};
