const fs = require('fs');
const { reply } = require('./_helper');
const FILE = './data/msgcount.json';
function get() { try { return JSON.parse(fs.readFileSync(FILE,'utf8')); } catch { return {}; } }
function inc(gid, uid) { const d=get(); if(!d[gid]) d[gid]={}; d[gid][uid]=(d[gid][uid]||0)+1; fs.writeFileSync(FILE,JSON.stringify(d,null,2)); }
async function topMembersCommand(sock, chatId, message) {
    if (!chatId.endsWith('@g.us')) return reply(sock, chatId, '❌ Groups only.', message);
    const d=get(); const g=d[chatId]||{};
    if (!Object.keys(g).length) return reply(sock, chatId, '📊 No data yet. Members need to send messages first!', message);
    const sorted=Object.entries(g).sort(([,a],[,b])=>b-a).slice(0,10);
    const meta=await sock.groupMetadata(chatId); const mentions=sorted.map(([id])=>id);
    const medals=['🥇','🥈','🥉','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];
    let text=`📊 *Top Members — ${meta.subject}*\n\n`;
    sorted.forEach(([id,count],i) => { text+=`${medals[i]} @${id.split('@')[0]} — *${count}* msgs\n`; });
    text+=`\n_© ScottyMd by Scotty_`;
    await sock.sendMessage(chatId,{text,mentions},{quoted:message});
}
module.exports = { topMembersCommand, inc };
