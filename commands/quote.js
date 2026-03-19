const axios = require('axios');
const { reply } = require('./_helper');
const fallback = [{c:"The only way to do great work is to love what you do.",a:"Steve Jobs"},{c:"In the middle of every difficulty lies opportunity.",a:"Albert Einstein"}];
module.exports = async (sock, chatId, message) => {
    try {
        let q, a;
        try { const res=await axios.get('https://api.quotable.io/random',{timeout:8000}); q=res.data.content; a=res.data.author; }
        catch { const r=fallback[Math.floor(Math.random()*fallback.length)]; q=r.c; a=r.a; }
        await reply(sock, chatId, `💬 *Quote*\n\n_"${q}"_\n\n— *${a}*\n\n_© ScottyMd by Scotty_`, message);
    } catch(e) { await reply(sock, chatId, '❌ Failed to fetch quote.', message); }
};
