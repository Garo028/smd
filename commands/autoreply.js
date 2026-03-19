const fs = require('fs');
const { reply, getSender } = require('./_helper');
const isOwner = require('../lib/isOwner');
const FILE  = './data/autoreply.json';
const replied = new Set();
function get() { try { return JSON.parse(fs.readFileSync(FILE,'utf8')); } catch { return {enabled:false,message:'Hi! Away right now.\n\n_ScottyMd Bot_'}; } }
function save(d) { fs.writeFileSync(FILE,JSON.stringify(d,null,2)); }
async function autoReplyCommand(sock, chatId, message, args) {
    const sender = getSender(sock, message);
    if (!isOwner(sender)) return reply(sock, chatId, '❌ Owner only.', message);
    const d = get(); const sub = args[0]?.toLowerCase();
    if (!sub) return reply(sock, chatId, `🤖 *Auto Reply*\nStatus: ${d.enabled?'✅ ON':'❌ OFF'}\nMsg: _${d.message}_\n\n.autoreply on\n.autoreply off\n.autoreply set <msg>`, message);
    if (sub==='on')  { d.enabled=true;  replied.clear(); save(d); return reply(sock,chatId,'✅ Auto-reply enabled!',message); }
    if (sub==='off') { d.enabled=false; save(d); return reply(sock,chatId,'❌ Disabled.',message); }
    if (sub==='set') { const msg=args.slice(1).join(' ').trim(); if(!msg) return reply(sock,chatId,'❌ Usage: .autoreply set <message>',message); d.message=msg; d.enabled=true; save(d); return reply(sock,chatId,`✅ Set!\n_${msg}_`,message); }
}
async function handleAutoReply(sock, message) {
    try {
        const d = get(); if (!d.enabled) return;
        const chatId = message.key.remoteJid;
        if (chatId?.endsWith('@g.us') || message.key.fromMe || chatId==='status@broadcast') return;
        if (replied.has(chatId)) return;
        replied.add(chatId);
        await sock.sendMessage(chatId, { text: d.message }, { quoted: message });
    } catch {}
}
module.exports = { autoReplyCommand, handleAutoReply };
