const { reply } = require('./_helper');
module.exports = async (sock, chatId, message) => {
    await reply(sock, chatId, `🪙 ${Math.random()<0.5 ? '*HEADS*' : '*TAILS*'}\n\n_© ScottyMd by Scotty_`, message);
};
