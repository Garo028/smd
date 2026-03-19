const { reply, getSender } = require('./_helper');
module.exports = async (sock, chatId, message, args) => {
    try {
        if (args.length < 2) return reply(sock, chatId, '❌ Usage: .remind <time> <message>\nTime: 30s, 10m, 2h\nExample: .remind 30m Check the food', message);
        const t=args[0].toLowerCase(), msg=args.slice(1).join(' ');
        let ms=0;
        if (t.endsWith('s')) ms=parseInt(t)*1000;
        else if (t.endsWith('m')) ms=parseInt(t)*60000;
        else if (t.endsWith('h')) ms=parseInt(t)*3600000;
        else return reply(sock, chatId, '❌ Use: 30s, 10m, 2h', message);
        if (!ms||ms<=0) return reply(sock, chatId, '❌ Invalid time.', message);
        if (ms>86400000) return reply(sock, chatId, '❌ Max 24 hours.', message);
        const sender = getSender(sock, message);
        await reply(sock, chatId, `⏰ Reminder set for *${t}*!\n📝 _${msg}_\n\n_© ScottyMd by Scotty_`, message);
        setTimeout(async () => {
            try { await sock.sendMessage(chatId, { text: `⏰ *REMINDER!*\n\n@${sender.split('@')[0]}\n\n📝 _${msg}_\n\n_© ScottyMd by Scotty_`, mentions:[sender] }); } catch {}
        }, ms);
    } catch(e) { await reply(sock, chatId, '❌ Reminder failed.', message); }
};
