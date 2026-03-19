const { getMentioned, reply } = require('./_helper');
const C = ["You have the most incredible smile! 😊","You're one of the most genuine people! 💯","Your kindness is a superpower! 💪","You make the world a better place! 🌍","You're stronger than you know! 🦁","Your energy is contagious! ⚡","You're not just talented — you're exceptional! 🌟"];
module.exports = async (sock, chatId, message) => {
    const mentioned = getMentioned(message);
    const comp = C[Math.floor(Math.random()*C.length)];
    if (!mentioned.length) return reply(sock, chatId, `💌 *Compliment*\n\n${comp}\n\n_© ScottyMd by Scotty_`, message);
    await sock.sendMessage(chatId, { text: `💌 *For @${mentioned[0].split('@')[0]}*\n\n${comp}\n\n_© ScottyMd by Scotty_`, mentions: [mentioned[0]] }, { quoted: message });
};
