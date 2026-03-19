const { getMentioned, reply, getSender } = require('./_helper');
const { isAdmin } = require('./_helper');
const isOwner = require('../lib/isOwner');
module.exports = async (sock, chatId, message) => {
    try {
        const mentioned = getMentioned(message);
        const target = mentioned[0] || getSender(sock, message);
        const num = target.split('@')[0];
        let status='Hidden', role='User';
        try { const s=await sock.fetchStatus(target); if(s?.status) status=s.status; } catch {}
        if (chatId.endsWith('@g.us')) {
            if (await isAdmin(sock,chatId,target)) role='⭐ Admin'; else role='👤 Member';
        }
        if (isOwner(target)) role+=' | 🔑 Bot Owner';
        await sock.sendMessage(chatId,{text:`👤 *Who Is*\n\n📱 +${num}\n🏷️ Role: ${role}\n💬 Status: ${status}\n\n_© ScottyMd by Scotty_`,mentions:[target]},{quoted:message});
    } catch(e) { await reply(sock,chatId,'❌ Failed.',message); }
};
