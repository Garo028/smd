const fs = require('fs');
const { checkAdmin, reply } = require('./_helper');
const FILE = './data/goodbye.json';
function get() { try { return JSON.parse(fs.readFileSync(FILE,'utf8')); } catch { return {}; } }
function save(d) { fs.writeFileSync(FILE,JSON.stringify(d,null,2)); }
async function goodbyeCommand(sock, chatId, message, args) {
    if (!chatId.endsWith('@g.us')) return reply(sock, chatId, '❌ Groups only.', message);
    if (!await checkAdmin(sock, chatId, message)) return reply(sock, chatId, '❌ Admins only.', message);
    const d = get(); const sub = args[0]?.toLowerCase();
    if (!sub || sub === 'status') return reply(sock, chatId, `*Goodbye*\nStatus: ${d[chatId]?.enabled?'✅ ON':'❌ OFF'}\n\n.goodbye on\n.goodbye off\n.goodbye set <msg>`, message);
    if (sub === 'on')  { d[chatId]={...d[chatId],enabled:true};  save(d); return reply(sock, chatId, '✅ Goodbye enabled!', message); }
    if (sub === 'off') { d[chatId]={...d[chatId],enabled:false}; save(d); return reply(sock, chatId, '❌ Goodbye disabled.', message); }
    if (sub === 'set') {
        const msg = args.slice(1).join(' ').trim();
        if (!msg) return reply(sock, chatId, '❌ Usage: .goodbye set Your message @user', message);
        d[chatId] = {...d[chatId], msg, enabled:true}; save(d);
        return reply(sock, chatId, `✅ Goodbye set!\n_${msg}_`, message);
    }
}
async function handleLeave(sock, gid, participants) {
    try {
        const d = get(); const c = d[gid];
        if (!c?.enabled) return;
        const meta = await sock.groupMetadata(gid);
        for (const p of participants) {
            let msg = c.msg || `👋 @${p.split('@')[0]} left *${meta.subject}*. Goodbye!`;
            msg = msg.replace(/@user/gi, `@${p.split('@')[0]}`);
            await sock.sendMessage(gid, { text: msg, mentions: [p] });
        }
    } catch {}
}
module.exports = { goodbyeCommand, handleLeave };
