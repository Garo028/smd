const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { reply, getSender } = require('./_helper');
module.exports = async (sock, chatId, message) => {
    try {
        const ctx    = message.message?.extendedTextMessage?.contextInfo;
        const quoted = ctx?.quotedMessage;
        if (!quoted) return reply(sock, chatId, '❌ Reply to a status/story with .savestatus', message);
        const imgMsg = quoted?.imageMessage;
        const vidMsg = quoted?.videoMessage;
        const txtMsg = quoted?.conversation || quoted?.extendedTextMessage?.text;
        const botNum = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        if (txtMsg) {
            await sock.sendMessage(botNum, { text: `📝 *Saved Status*\n\n${txtMsg}\n\n_© ScottyMd by Scotty_` });
            return reply(sock, chatId, '✅ Text status saved to your chat!', message);
        }
        if (!imgMsg && !vidMsg) return reply(sock, chatId, '❌ No media found in quoted message.', message);
        const type   = imgMsg ? 'image' : 'video';
        const stream = await downloadContentFromMessage(imgMsg || vidMsg, type);
        const chunks = []; for await (const c of stream) chunks.push(c);
        const buf = Buffer.concat(chunks);
        const cap = `✅ *Saved Status*\n_© ScottyMd by Scotty_`;
        if (type==='image') await sock.sendMessage(botNum, { image: buf, caption: cap });
        else await sock.sendMessage(botNum, { video: buf, caption: cap });
        await reply(sock, chatId, `✅ ${type.charAt(0).toUpperCase()+type.slice(1)} status saved to your chat!`, message);
    } catch(e) { await reply(sock, chatId, '❌ Failed to save status.', message); }
};
