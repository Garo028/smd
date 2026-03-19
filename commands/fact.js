const axios = require('axios');
const { reply } = require('./_helper');
const fallback = ["Honey never spoils — 3000-year-old honey from Egypt was still edible.","A group of flamingos is called a flamboyance.","Octopuses have three hearts.","Sharks are older than trees."];
module.exports = async (sock, chatId, message) => {
    try {
        let fact;
        try { const r=await axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en',{timeout:8000}); fact=r.data.text; }
        catch { fact=fallback[Math.floor(Math.random()*fallback.length)]; }
        await reply(sock, chatId, `🧠 *Random Fact*\n\n${fact}\n\n_© ScottyMd by Scotty_`, message);
    } catch(e) { await reply(sock, chatId, '❌ Failed to fetch fact.', message); }
};
