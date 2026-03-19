const fs = require('fs');
const { checkAdmin, getMentioned, reply, getSender } = require('./_helper');
const isOwner = require('../lib/isOwner');
const FILE = './data/banned.json';
function getB() { try { return JSON.parse(fs.readFileSync(FILE,'utf8')); } catch { return []; } }
function saveB(d) { fs.writeFileSync(FILE,JSON.stringify(d,null,2)); }
module.exports = async (sock, chatId, message) => {
    const sender = getSender(sock, message);
    if (!await checkAdmin(sock, chatId, message) && !isOwner(sender)) return reply(sock, chatId, '❌ Admins only.', message);
    const mentioned = getMentioned(message);
    if (!mentioned.length) return reply(sock, chatId, '❌ Usage: .ban @user', message);
    const banned = getB();
    for (const user of mentioned) {
        if (isOwner(user)) { await sock.sendMessage(chatId,{text:`❌ Cannot ban owner.`,mentions:[user]},{quoted:message}); continue; }
        if (banned.includes(user)) { await sock.sendMessage(chatId,{text:`⚠️ @${user.split('@')[0]} already banned.`,mentions:[user]},{quoted:message}); continue; }
        banned.push(user); saveB(banned);
        await sock.sendMessage(chatId,{text:`🚫 @${user.split('@')[0]} banned from bot.`,mentions:[user]},{quoted:message});
    }
};
