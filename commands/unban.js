const fs = require('fs');
const { checkAdmin, getMentioned, reply } = require('./_helper');
const FILE = './data/banned.json';
function getB() { try { return JSON.parse(fs.readFileSync(FILE,'utf8')); } catch { return []; } }
module.exports = async (sock, chatId, message) => {
    if (!await checkAdmin(sock, chatId, message)) return reply(sock, chatId, '❌ Admins only.', message);
    const mentioned = getMentioned(message);
    if (!mentioned.length) return reply(sock, chatId, '❌ Usage: .unban @user', message);
    let banned = getB();
    for (const user of mentioned) {
        if (!banned.includes(user)) { await sock.sendMessage(chatId,{text:`⚠️ @${user.split('@')[0]} is not banned.`,mentions:[user]},{quoted:message}); continue; }
        banned = banned.filter(u=>u!==user);
        fs.writeFileSync(FILE,JSON.stringify(banned,null,2));
        await sock.sendMessage(chatId,{text:`✅ @${user.split('@')[0]} unbanned.`,mentions:[user]},{quoted:message});
    }
};
