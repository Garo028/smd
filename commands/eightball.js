const { reply } = require('./_helper');
const answers = ['It is certain! 🎯','Without a doubt! ✅','Yes, definitely! 💯','Most likely! 📈','Signs point to yes! ☝️','Reply hazy, try again 🌫️','Ask again later ⏳','Cannot predict now 🔮','Don\'t count on it! 🚫','My reply is no! ❌','Very doubtful! 🤔','Outlook not so good 😬'];
module.exports = async (sock, chatId, message, args) => {
    const q = args.join(' ').trim();
    if (!q) return reply(sock, chatId, '❌ Usage: .8ball <question>', message);
    const ans = answers[Math.floor(Math.random()*answers.length)];
    await reply(sock, chatId, `🎱 *Magic 8 Ball*\n\n❓ ${q}\n\n${ans}\n\n_© ScottyMd by Scotty_`, message);
};
