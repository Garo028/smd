const { getMentioned, reply } = require('./_helper');
const I = ["You're the reason the gene pool needs a lifeguard. 🏊","You have the personality of a wet sock. 🧦","Even your Wi-Fi signal has more personality than you. 📶","You're so slow, you'd be late to your own funeral. ⚰️","Your secrets are safe — I never listen when you talk. 👂"];
module.exports = async (sock, chatId, message) => {
    const mentioned = getMentioned(message);
    const ins = I[Math.floor(Math.random()*I.length)];
    if (!mentioned.length) return reply(sock, chatId, `😂 *Funny Insult*\n\n${ins}\n\n_All in good fun!_\n_© ScottyMd by Scotty_`, message);
    await sock.sendMessage(chatId, { text: `😂 *@${mentioned[0].split('@')[0]}*\n\n${ins}\n\n_All in good fun!_\n_© ScottyMd by Scotty_`, mentions: [mentioned[0]] }, { quoted: message });
};
