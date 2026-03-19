const { checkAdmin, checkBotAdmin, getMentioned, reply, getSender } = require('./_helper');
module.exports = async (sock, chatId, message) => {
    if (!chatId.endsWith('@g.us')) return reply(sock, chatId, '❌ Groups only.', message);
    if (!await checkAdmin(sock, chatId, message)) return reply(sock, chatId, '❌ Admins only.', message);
    if (!await checkBotAdmin(sock, chatId)) return reply(sock, chatId, '❌ Make me an admin first.', message);
    const mentioned = getMentioned(message);
    if (!mentioned.length) return reply(sock, chatId, '❌ Mention or reply to a user.\n*Usage:* .kick @user', message);
    const { isAdmin } = require('./_helper');
    for (const user of mentioned) {
        if (await isAdmin(sock, chatId, user)) {
            await sock.sendMessage(chatId, { text: `⚠️ Cannot kick @${user.split('@')[0]} — they are an admin.`, mentions: [user] }, { quoted: message });
            continue;
        }
        await sock.groupParticipantsUpdate(chatId, [user], 'remove');
        await sock.sendMessage(chatId, { text: `✅ @${user.split('@')[0]} kicked.`, mentions: [user] });
    }
};
