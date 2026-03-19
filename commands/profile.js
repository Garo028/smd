const { getMentioned, reply, getSender } = require('./_helper');
const { getBuffer } = require('../lib/myfunc');
const { isAdmin } = require('./_helper');
const isOwner = require('../lib/isOwner');
module.exports = async (sock, chatId, message) => {
    try {
        const mentioned = getMentioned(message);
        const target = mentioned[0] || getSender(sock, message);
        const num = target.split('@')[0];
        await reply(sock, chatId, `🔍 Fetching profile...`, message);
        let status='Hidden', ppBuf=null, role='User';
        try { const s=await sock.fetchStatus(target); if(s?.status) status=s.status; } catch {}
        try { ppBuf=await getBuffer(await sock.profilePictureUrl(target,'image')); } catch {}
        if (chatId.endsWith('@g.us')) {
            try {
                const meta=await sock.groupMetadata(chatId);
                const p=meta.participants.find(x=>x.id.includes(num));
                if(p?.admin==='superadmin') role='👑 Owner'; else if(p?.admin==='admin') role='⭐ Admin'; else role='👤 Member';
            } catch {}
        }
        if (isOwner(target)) role+=' | 🔑 Bot Owner';
        const text=`👤 *Profile*\n\n📱 +${num}\n🏷️ Role: ${role}\n💬 Status: ${status}\n\n_© ScottyMd by Scotty_`;
        if (ppBuf) await sock.sendMessage(chatId,{image:ppBuf,caption:text,mentions:[target]},{quoted:message});
        else await sock.sendMessage(chatId,{text,mentions:[target]},{quoted:message});
    } catch(e) { await reply(sock, chatId, '❌ Failed to fetch profile.', message); }
};
