const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { reply } = require('./_helper');
module.exports = async (sock, chatId, message) => {
    try {
        const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const msg    = quoted || message.message;
        const stkMsg = msg?.stickerMessage;
        if (!stkMsg) return reply(sock, chatId, '❌ Reply to a sticker with .toimg', message);
        const stream = await downloadContentFromMessage(stkMsg, 'sticker');
        const chunks = []; for await (const c of stream) chunks.push(c);
        const buf = Buffer.concat(chunks);
        if (stkMsg.isAnimated) {
            await sock.sendMessage(chatId, { video: buf, caption: '✅ Converted!\n_© ScottyMd by Scotty_' }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, { image: buf, caption: '✅ Converted!\n_© ScottyMd by Scotty_' }, { quoted: message });
        }
    } catch(e) { await reply(sock, chatId, '❌ Failed to convert sticker.', message); }
};
