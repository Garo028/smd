const { checkAdmin, checkBotAdmin, getMentioned, reply } = require('./_helper');
module.exports = async (sock, chatId, message) => {
    if (!chatId.endsWith('@g.us')) return reply(sock, chatId, '❌ Groups only.', message);
    if (!await checkAdmin(sock, chatId, message)) return reply(sock, chatId, '❌ Admins only.', message);
    if (!await checkBotAdmin(sock, chatId)) return reply(sock, chatId, '❌ Make me an admin first.', message);
    const mentioned = getMentioned(message);
    if (!mentioned.length) return reply(sock, chatId, '❌ Usage: .promote @user', message);
    for (const user of mentioned) {
        await sock.groupParticipantsUpdate(chatId, [user], 'promote');
        await sock.sendMessage(chatId, { text: `⭐ @${user.split('@')[0]} promoted to admin!`, mentions: [user] });
    }
};
