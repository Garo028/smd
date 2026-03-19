const fs = require('fs');
const { reply, getSender } = require('./_helper');
const isOwner = require('../lib/isOwner');
const FILE = './data/mode.json';
function getMode() { try { return JSON.parse(fs.readFileSync(FILE,'utf8')); } catch { return {mode:'public'}; } }
function saveMode(d) { fs.writeFileSync(FILE,JSON.stringify(d,null,2)); }
async function modeCommand(sock, chatId, message, args) {
    const sender = getSender(sock, message);
    if (!isOwner(sender)) return reply(sock, chatId, '❌ Owner only.', message);
    const current = getMode().mode;
    const sub = args[0]?.toLowerCase();
    if (!sub) return reply(sock, chatId, `🌐 *Bot Mode*\nCurrent: *${current.toUpperCase()}*\n\n.mode public\n.mode private`, message);
    if (!['public','private'].includes(sub)) return reply(sock, chatId, '❌ Use: .mode public OR .mode private', message);
    saveMode({mode:sub}); sock.public = sub === 'public';
    await reply(sock, chatId, `✅ Mode set to *${sub.toUpperCase()}*\n\n${sub==='public'?'🌍 Everyone can use the bot.':'🔒 Only owner can use the bot.'}\n\n_© ScottyMd by Scotty_`, message);
}
module.exports = { modeCommand, getMode };
