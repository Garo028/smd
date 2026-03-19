const { reply } = require('./_helper');
const D = ["Send a voice note singing your favourite song.","Change your profile picture to a silly face for 1 hour.","Text the last person you texted saying 'I love you'.","Do 20 push-ups right now.","Send a cringe-worthy selfie to this chat.","Post a status with only emojis for 10 minutes.","Call someone in this group and sing Happy Birthday."];
module.exports = async (sock, chatId, message) => {
    await reply(sock, chatId, `🔥 *Dare*\n\n_${D[Math.floor(Math.random()*D.length)]}_\n\n_© ScottyMd by Scotty_`, message);
};
