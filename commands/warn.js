const fs = require('fs');
const { checkAdmin, getMentioned, reply } = require('./_helper');
const { WARN_COUNT } = require('../config');
const FILE = './data/warnings.json';
function getW() { try { return JSON.parse(fs.readFileSync(FILE,'utf8')); } catch { return {}; } }
function saveW(d) { fs.writeFileSync(FILE, JSON.stringify(d,null,2)); }
module.exports = async (sock, chatId, message) => {
    if (!chatId.endsWith('@g.us')) return reply(sock, chatId, '❌ Groups only.', message);
    if (!await checkAdmin(sock, chatId, message)) return reply(sock, chatId, '❌ Admins only.', message);
    const mentioned = getMentioned(message);
    if (!mentioned.length) return reply(sock, chatId, '❌ Usage: .warn @user', message);
    const w = getW(); const max = WARN_COUNT || 3;
    for (const user of mentioned) {
        const key = `${chatId}_${user}`;
        w[key] = (w[key]||0)+1; const count = w[key]; saveW(w);
        if (count >= max) {
            await sock.sendMessage(chatId, { text: `⛔ @${user.split('@')[0]} reached *${count}/${max}* warnings and was kicked!`, mentions: [user] });
            try { await sock.groupParticipantsUpdate(chatId, [user], 'remove'); } catch {}
            w[key] = 0; saveW(w);
        } else {
            await sock.sendMessage(chatId, { text: `⚠️ *Warning ${count}/${max}*\n@${user.split('@')[0]} has been warned!\n_${max-count} more before kick._`, mentions: [user] }, { quoted: message });
        }
    }
};
