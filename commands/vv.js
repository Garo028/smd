const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { reply } = require('./_helper');
module.exports = async (sock, chatId, message) => {
    try {
        const ctx    = message.message?.extendedTextMessage?.contextInfo;
        const quoted = ctx?.quotedMessage;
        if (!quoted) return reply(sock, chatId, '❌ Reply to a view-once message with .vv', message);
        const voMsg  = quoted?.viewOnceMessage?.message || quoted?.viewOnceMessageV2?.message || quoted;
        const imgMsg = voMsg?.imageMessage;
        const vidMsg = voMsg?.videoMessage;
        const audMsg = voMsg?.audioMessage;
        if (!imgMsg && !vidMsg && !audMsg) return reply(sock, chatId, '❌ Not a view-once media message.', message);
        await reply(sock, chatId, '🔓 Revealing...', message);
        let type, mediaMsg;
        if (imgMsg) { type='image'; mediaMsg=imgMsg; }
        else if (vidMsg) { type='video'; mediaMsg=vidMsg; }
        else { type='audio'; mediaMsg=audMsg; }
        const stream = await downloadContentFromMessage(mediaMsg, type);
        const chunks = []; for await (const c of stream) chunks.push(c);
        const buf = Buffer.concat(chunks);
        const cap = '🔓 *View Once Revealed*\n_© ScottyMd by Scotty_';
        if (type==='image') await sock.sendMessage(chatId, { image: buf, caption: cap }, { quoted: message });
        else if (type==='video') await sock.sendMessage(chatId, { video: buf, caption: cap }, { quoted: message });
        else await sock.sendMessage(chatId, { audio: buf, mimetype: 'audio/mpeg', ptt: mediaMsg.ptt||false }, { quoted: message });
    } catch(e) { await reply(sock, chatId, '❌ Could not reveal. Message may have expired.', message); }
};
