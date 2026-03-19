const { reply, getSender } = require('./_helper');
const isOwner = require('../lib/isOwner');
module.exports = async (sock, chatId, message, args) => {
    const sender = getSender(sock, message);
    if (!isOwner(sender)) return reply(sock, chatId, '❌ Owner only.', message);
    let phone = args[0]?.replace(/[^0-9]/g,'');
    if (!phone) return reply(sock, chatId, '❌ Usage: .pair <number>\nExample: .pair 263788114185', message);
    await reply(sock, chatId, `📱 Requesting pairing code for +${phone}...`, message);
    try {
        let code = await sock.requestPairingCode(phone);
        code = code?.match(/.{1,4}/g)?.join('-') || code;
        await reply(sock, chatId, `✅ *Pairing Code for +${phone}*\n\n🔐 Code: *${code}*\n\n1. Open WhatsApp\n2. Settings → Linked Devices\n3. Link a Device\n4. Link with phone number\n5. Enter: *${code}*\n\n⏰ Expires in 60 seconds\n\n_© ScottyMd by Scotty_`, message);
    } catch(e) {
        await reply(sock, chatId, `❌ Failed: ${e.message}\nMake sure number is on WhatsApp.`, message);
    }
};
