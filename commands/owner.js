const settings = require('../settings');
const { reply } = require('./_helper');
module.exports = async (sock, chatId, message) => {
    await reply(sock, chatId,
        `👤 *Bot Owner*\n\n📛 Name: ${settings.botOwner}\n📱 Number: +${settings.ownerNumber}\n\n_© ScottyMd by Scotty_`,
        message);
    try {
        await sock.sendMessage(chatId, {
            contacts: { displayName: settings.botOwner, contacts: [{
                vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${settings.botOwner}\nTEL;type=CELL;waid=${settings.ownerNumber}:+${settings.ownerNumber}\nEND:VCARD`
            }]}
        });
    } catch {}
};
