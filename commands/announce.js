const { checkAdmin, reply } = require('./_helper');
module.exports = async (sock, chatId, message, args) => {
    if (!chatId.endsWith('@g.us')) return reply(sock, chatId, '❌ Groups only.', message);
    if (!await checkAdmin(sock, chatId, message)) return reply(sock, chatId, '❌ Admins only.', message);
    const text = args.join(' ').trim();
    if (!text) return reply(sock, chatId, '❌ Usage: .announce <message>', message);
    const meta = await sock.groupMetadata(chatId);
    await sock.sendMessage(chatId, { text: `📢 *ANNOUNCEMENT*\n\n${text}\n\n_© ScottyMd by Scotty_`, mentions: meta.participants.map(p=>p.id) });
};
