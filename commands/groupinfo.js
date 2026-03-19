const { reply } = require('./_helper');
module.exports = async (sock, chatId, message) => {
    if (!chatId.endsWith('@g.us')) return reply(sock, chatId, '❌ Groups only.', message);
    const meta    = await sock.groupMetadata(chatId);
    const admins  = meta.participants.filter(p=>p.admin).length;
    const members = meta.participants.length;
    const created = new Date(meta.creation*1000).toDateString();
    const desc    = meta.desc?.trim().slice(0,200) || 'No description';
    await reply(sock, chatId,
        `📋 *Group Info*\n\n🏷️ Name: ${meta.subject}\n👥 Members: ${members}\n⭐ Admins: ${admins}\n📅 Created: ${created}\n💬 Messaging: ${meta.announce?'Admins only':'Everyone'}\n\n📝 ${desc}\n\n_© ScottyMd by Scotty_`,
        message);
};
