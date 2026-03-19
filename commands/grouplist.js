const { reply, getSender } = require('./_helper');
const isOwner = require('../lib/isOwner');
module.exports = async (sock, chatId, message) => {
    const sender = getSender(sock, message);
    if (!isOwner(sender)) return reply(sock, chatId, '❌ Owner only.', message);
    await reply(sock, chatId, '📋 Fetching groups...', message);
    const groups = Object.values(await sock.groupFetchAllParticipating());
    if (!groups.length) return reply(sock, chatId, '📋 Not in any groups.', message);
    let text = `📋 *Bot Groups (${groups.length})*\n\n`;
    groups.forEach((g,i) => { text += `*${i+1}.* ${g.subject} — ${g.participants.length} members\n`; });
    text += `\n_© ScottyMd by Scotty_`;
    if (text.length > 4000) text = text.slice(0,4000) + '...';
    await reply(sock, chatId, text, message);
};
