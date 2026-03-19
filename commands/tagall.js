const { reply } = require('./_helper');
module.exports = async (sock, chatId, message, args) => {
    if (!chatId.endsWith('@g.us')) return reply(sock, chatId, '❌ Groups only.', message);
    const meta = await sock.groupMetadata(chatId);
    const mentions = meta.participants.map(p => p.id);
    const text = (args.join(' ') || '📢 Attention!') + '\n\n' + mentions.map(m => `@${m.split('@')[0]}`).join(' ');
    await sock.sendMessage(chatId, { text, mentions }, { quoted: message });
};
