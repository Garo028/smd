const { getMentioned, reply } = require('./_helper');
const R = ["You're the human equivalent of a participation trophy. 🏆","I'd explain it but I don't have crayons with me. 🖍️","You're the reason they put instructions on shampoo. 😂","You bring joy whenever you leave the room. 🚪","You're like a cloud — when you disappear it's a beautiful day. ☀️","Your wifi signal has more personality than you. 📶","You're not stupid — you just have bad luck thinking. 🧠"];
module.exports = async (sock, chatId, message) => {
    const mentioned = getMentioned(message);
    const roast = R[Math.floor(Math.random()*R.length)];
    if (!mentioned.length) return reply(sock, chatId, `🔥 *Roast*\n\n${roast}\n\n_© ScottyMd by Scotty_`, message);
    await sock.sendMessage(chatId, { text: `🔥 *Roasting @${mentioned[0].split('@')[0]}*\n\n${roast}\n\n😂\n\n_© ScottyMd by Scotty_`, mentions: [mentioned[0]] }, { quoted: message });
};
