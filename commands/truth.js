const { reply } = require('./_helper');
const T = ["What is the most embarrassing thing you've done?","Have you ever lied to get out of trouble?","What is your biggest fear?","Have you ever cheated on a test?","What is the most childish thing you still do?","What is something you've never told anyone?","What is your biggest regret?","What is the worst gift you've received?"];
module.exports = async (sock, chatId, message) => {
    await reply(sock, chatId, `🤍 *Truth*\n\n_${T[Math.floor(Math.random()*T.length)]}_\n\n_© ScottyMd by Scotty_`, message);
};
