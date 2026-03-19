const axios = require('axios');
const { reply } = require('./_helper');
module.exports = async (sock, chatId, message, args) => {
    try {
        if (args.length < 3) return reply(sock, chatId, '❌ Usage: .currency <amount> <from> <to>\nExample: .currency 100 USD ZWL', message);
        const amount=parseFloat(args[0]), from=args[1].toUpperCase(), to=args[2].toUpperCase();
        if (isNaN(amount)) return reply(sock, chatId, '❌ Amount must be a number.', message);
        const res  = await axios.get(`https://api.exchangerate-api.com/v4/latest/${from}`,{timeout:10000});
        const rate = res.data.rates[to];
        if (!rate) return reply(sock, chatId, `❌ Currency *${to}* not found.`, message);
        const result = (amount * rate).toFixed(2);
        await reply(sock, chatId, `💱 *Currency*\n\n💵 ${amount} *${from}* = 💰 *${result} ${to}*\n📊 Rate: 1 ${from} = ${rate.toFixed(4)} ${to}\n\n_© ScottyMd by Scotty_`, message);
    } catch(e) { await reply(sock, chatId, '❌ Conversion failed. Check currency codes.', message); }
};
