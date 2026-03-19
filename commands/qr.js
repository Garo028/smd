const axios = require('axios');
const { reply } = require('./_helper');
module.exports = async (sock, chatId, message, args) => {
    try {
        const text = args.join(' ').trim();
        if (!text) return reply(sock, chatId, '❌ Usage: .qr <text or URL>', message);
        await reply(sock, chatId, '⏳ Generating QR code...', message);
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(text)}`;
        const res = await axios.get(url, { responseType:'arraybuffer', timeout:15000 });
        await sock.sendMessage(chatId, { image: Buffer.from(res.data), caption: `✅ *QR Code*\n📝 ${text.slice(0,80)}\n\n_© ScottyMd by Scotty_` }, { quoted: message });
    } catch(e) { await reply(sock, chatId, '❌ QR generation failed.', message); }
};
