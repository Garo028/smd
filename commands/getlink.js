const { checkAdmin, checkBotAdmin, reply } = require('./_helper');
module.exports = async (sock, chatId, message) => {
    if (!chatId.endsWith('@g.us')) return reply(sock, chatId, '❌ Groups only.', message);
    if (!await checkAdmin(sock, chatId, message)) return reply(sock, chatId, '❌ Admins only.', message);
    if (!await checkBotAdmin(sock, chatId)) return reply(sock, chatId, '❌ Make me an admin first.', message);
    const code = await sock.groupInviteCode(chatId);
    const meta = await sock.groupMetadata(chatId);
    await reply(sock, chatId, `🔗 *Group Invite Link*\n\n📛 ${meta.subject}\n\nhttps://chat.whatsapp.com/${code}\n\n_© ScottyMd by Scotty_`, message);
};
