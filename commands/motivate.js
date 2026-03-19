const axios = require('axios');
const { reply } = require('./_helper');
module.exports = async (sock, chatId, message) => {
    try {
        let q,a;
        try { const r=await axios.get('https://api.quotable.io/random?tags=motivational',{timeout:8000}); q=r.data.content; a=r.data.author; }
        catch { q='Keep going — every day is a new chance to improve!'; a='ScottyMd'; }
        await reply(sock, chatId, `💪 *Motivation*\n\n_"${q}"_\n\n— *${a}*\n\n_© ScottyMd by Scotty_`, message);
    } catch(e) { await reply(sock, chatId, '💪 Keep going! You got this!\n\n_© ScottyMd by Scotty_', message); }
};
