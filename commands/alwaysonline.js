const fs = require('fs');
const { reply, getSender } = require('./_helper');
const isOwner = require('../lib/isOwner');
const FILE = './data/alwaysonline.json';
let timer = null;
function get() { try { return JSON.parse(fs.readFileSync(FILE,'utf8')); } catch { return {enabled:false}; } }
function save(d) { fs.writeFileSync(FILE,JSON.stringify(d,null,2)); }
function start(sock) {
    if (timer) clearInterval(timer);
    timer = setInterval(async () => { try { await sock.sendPresenceUpdate('available'); } catch {} }, 10000);
}
function stop() { if (timer) { clearInterval(timer); timer = null; } }
async function alwaysOnlineCommand(sock, chatId, message, args) {
    const sender = getSender(sock, message);
    if (!isOwner(sender)) return reply(sock, chatId, '❌ Owner only.', message);
    const sub = args[0]?.toLowerCase();
    const d   = get();
    if (!sub) return reply(sock, chatId, `📡 *Always Online*\nStatus: ${d.enabled?'✅ ON':'❌ OFF'}\n\n.alwaysonline on\n.alwaysonline off`, message);
    if (sub==='on')  { d.enabled=true;  save(d); start(sock); return reply(sock, chatId, '✅ Always online enabled!', message); }
    if (sub==='off') { d.enabled=false; save(d); stop();       return reply(sock, chatId, '❌ Always online disabled.', message); }
}
function initAlwaysOnline(sock) { const d = get(); if (d.enabled) start(sock); }
module.exports = { alwaysOnlineCommand, initAlwaysOnline };
