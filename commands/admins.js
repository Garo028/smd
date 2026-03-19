const { getAdmins, reply } = require('./_helper');
module.exports = async (sock, chatId, message) => {
    if (!chatId.endsWith('@g.us')) return reply(sock, chatId, '❌ Groups only.', message);
    const meta   = await sock.groupMetadata(chatId);
    const admins = meta.participants.filter(p=>p.admin);
    let text = `⭐ *Admins — ${meta.subject}*\n\n`; const mentions = [];
    admins.forEach(a => {
        text += `${a.admin==='superadmin'?'👑':'⭐'} @${a.id.split('@')[0]}\n`;
        mentions.push(a.id);
    });
    text += `\n_Total: ${admins.length}_\n_© ScottyMd by Scotty_`;
    await sock.sendMessage(chatId, { text, mentions }, { quoted: message });
};
