const os = require('os');
const settings = require('../settings');
const { reply } = require('./_helper');
module.exports = async (sock, chatId, message) => {
    const up = process.uptime();
    const d=Math.floor(up/86400), h=Math.floor((up%86400)/3600), m=Math.floor((up%3600)/60);
    await reply(sock, chatId,
        `🖥️ *Device Info*\n\n🤖 Bot: ${settings.botName} v${settings.version}\n⏱️ Uptime: ${d}d ${h}h ${m}m\n💾 RAM: ${(process.memoryUsage().rss/1024/1024).toFixed(1)}MB / ${(os.totalmem()/1024/1024).toFixed(0)}MB\n⚙️ Node: ${process.version}\n🖥️ Platform: ${os.platform()} ${os.arch()}\n\n_© ScottyMd by Scotty_`,
        message);
};
