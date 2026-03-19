const fs = require('fs');
const { checkAdmin, reply, getSender } = require('./_helper');
const isOwner = require('../lib/isOwner');
const { isAdmin } = require('./_helper');
const FILE    = './data/antispam.json';
const tracker = new Map();
const LIMIT   = 7, WINDOW = 5000;
function get() { try { return JSON.parse(fs.readFileSync(FILE,'utf8')); } catch { return {}; } }
function save(d) { fs.writeFileSync(FILE,JSON.stringify(d,null,2)); }
async function antispamCommand(sock, chatId, message, args) {
    if (!chatId.endsWith('@g.us')) return reply(sock, chatId, '❌ Groups only.', message);
    if (!await checkAdmin(sock, chatId, message)) return reply(sock, chatId, '❌ Admins only.', message);
    const d = get(); const sub = args[0]?.toLowerCase();
    if (!sub) return reply(sock,chatId,`*Anti-Spam*\nStatus: ${d[chatId]?.enabled?'✅ ON':'❌ OFF'}\n\n.antispam on\n.antispam off`,message);
    if (sub==='on')  { d[chatId]={enabled:true};  save(d); return reply(sock,chatId,'🛡️ Anti-spam enabled!',message); }
    if (sub==='off') { d[chatId]={enabled:false}; save(d); return reply(sock,chatId,'❌ Disabled.',message); }
}
async function handleSpam(sock, chatId, message, sender) {
    if (!chatId.endsWith('@g.us')) return;
    const d = get(); if (!d[chatId]?.enabled) return;
    if (await isAdmin(sock,chatId,sender) || isOwner(sender)) return;
    const key = `${chatId}_${sender}`; const now = Date.now();
    const rec = tracker.get(key) || { count:0, first:now };
    if (now - rec.first > WINDOW) { tracker.set(key,{count:1,first:now}); return; }
    rec.count++; tracker.set(key,rec);
    if (rec.count >= LIMIT) {
        tracker.delete(key);
        try { await sock.sendMessage(chatId,{delete:message.key}); } catch {}
        await sock.sendMessage(chatId,{text:`⛔ @${sender.split('@')[0]} kicked for spamming!`,mentions:[sender]});
        try { await sock.groupParticipantsUpdate(chatId,[sender],'remove'); } catch {}
    } else if (rec.count === LIMIT-2) {
        await sock.sendMessage(chatId,{text:`⚠️ @${sender.split('@')[0]}, slow down!`,mentions:[sender]});
    }
}
module.exports = { antispamCommand, handleSpam };
