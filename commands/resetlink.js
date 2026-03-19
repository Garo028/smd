const { checkAdmin, checkBotAdmin, reply } = require('./_helper');
module.exports = async (sock, chatId, message) => {
    if (!chatId.endsWith('@g.us')) return reply(sock, chatId, '❌ Groups only.', message);
    if (!await checkAdmin(sock, chatId, message)) return reply(sock, chatId, '❌ Admins only.', message);
    if (!await checkBotAdmin(sock, chatId)) return reply(sock, chatId, '❌ Make me an admin first.', message);
    const code = await sock.groupRevokeInvite(chatId);
    await reply(sock, chatId, `🔗 *Link Reset!*\n\nNew link:\nhttps://chat.whatsapp.com/${code}\n\n⚠️ Old link no longer works.\n\n_© ScottyMd by Scotty_`, message);
};
