const { reply } = require('./_helper');
module.exports = async (sock, chatId, message, args) => {
    const sides = Math.min(parseInt(args[0])||6, 100);
    const roll  = Math.floor(Math.random()*sides)+1;
    await reply(sock, chatId, `🎲 *Dice (d${sides})*\n\nResult: *${roll}*\n\n_© ScottyMd by Scotty_`, message);
};
