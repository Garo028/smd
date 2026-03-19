const { reply } = require('./_helper');
module.exports = async (sock, chatId, message) => {
    const start = Date.now();
    await reply(sock, chatId, '🏓 Pinging...', message);
    await reply(sock, chatId, `🏓 *Pong!*\n⚡ Speed: *${Date.now()-start}ms*\n\n_© ScottyMd by Scotty_`, message);
};
