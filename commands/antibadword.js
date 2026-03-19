const fs = require('fs');
const { checkAdmin, reply, getSender } = require('./_helper');
const isOwner = require('../lib/isOwner');
const { isAdmin } = require('./_helper');
const FILE  = './data/antibadword.json';
const BADS  = ['fuck','shit','bitch','asshole','bastard','cunt','nigga','nigger','whore','slut'];
function get() { try { return JSON.parse(fs.readFileSync(FILE,'utf8')); } catch { return {}; } }
function save(d) { fs.writeFileSync(FILE,JSON.stringify(d,null,2)); }
async function antibadwordCommand(sock, chatId, message, args) {
    if (!chatId.endsWith('@g.us')) return reply(sock, chatId, '❌ Groups only.', message);
    if (!await checkAdmin(sock, chatId, message)) return reply(sock, chatId, '❌ Admins only.', message);
    const d = get(); const sub = args[0]?.toLowerCase();
    if (!sub) return reply(sock, chatId, `*Anti-Badword*\nStatus: ${d[chatId]?.enabled?'✅ ON':'❌ OFF'}\n\n.antibadword on\n.antibadword off\n.antibadword add <word>\n.antibadword list`, message);
    if (sub==='on')  { d[chatId]={...d[chatId],enabled:true,words:d[chatId]?.words||[...BADS]};  save(d); return reply(sock,chatId,'✅ Anti-badword enabled!',message); }
    if (sub==='off') { d[chatId]={...d[chatId],enabled:false}; save(d); return reply(sock,chatId,'❌ Disabled.',message); }
    if (sub==='add') { const w=args[1]?.toLowerCase(); if(!w) return reply(sock,chatId,'❌ Usage: .antibadword add <word>',message); const words=[...(d[chatId]?.words||BADS)]; if(!words.includes(w)) words.push(w); d[chatId]={...d[chatId],words}; save(d); return reply(sock,chatId,`✅ Added *${w}*`,message); }
    if (sub==='list') { const words=d[chatId]?.words||BADS; return reply(sock,chatId,`📋 Bad Words:\n${words.join(', ')}`,message); }
}
async function handleBadword(sock, chatId, message) {
    if (!chatId.endsWith('@g.us')) return;
    const d = get(); if (!d[chatId]?.enabled) return;
    const sender = getSender(sock, message);
    if (await isAdmin(sock,chatId,sender) || isOwner(sender)) return;
    const text = (message.message?.conversation||message.message?.extendedTextMessage?.text||'').toLowerCase();
    const words = d[chatId]?.words || BADS;
    if (!words.some(w => text.includes(w))) return;
    try { await sock.sendMessage(chatId, { delete: message.key }); } catch {}
    await sock.sendMessage(chatId, { text: `⚠️ @${sender.split('@')[0]}, watch your language!`, mentions: [sender] });
}
module.exports = { antibadwordCommand, handleBadword };
