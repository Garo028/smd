const settings = require('../settings');
const { reply } = require('./_helper');
const os = require('os');
module.exports = async (sock, chatId, message) => {
    const up = process.uptime();
    const h = Math.floor(up/3600), m = Math.floor((up%3600)/60), s = Math.floor(up%60);
    const ram = (process.memoryUsage().rss/1024/1024).toFixed(1);
    await reply(sock, chatId,
        `✅ *${settings.botName} is Alive!*\n\n⏱️ Uptime: ${h}h ${m}m ${s}s\n💾 RAM: ${ram}MB\n📦 Version: ${settings.version}\n🌐 Mode: ${settings.commandMode}\n\n_© ScottyMd by Scotty_`,
        message);
};
