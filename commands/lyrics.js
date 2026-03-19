const axios = require('axios');
const { reply } = require('./_helper');
module.exports = async (sock, chatId, message, args) => {
    try {
        const q = args.join(' ').trim();
        if (!q) return reply(sock, chatId, '❌ Usage: .lyrics <song>\nOr: .lyrics Artist - Song', message);
        await reply(sock, chatId, `🔍 Searching lyrics for *${q}*...`, message);
        let artist='', title='';
        if (q.includes(' - ')) { [artist,title]=q.split(' - ').map(s=>s.trim()); }
        else { title=q; artist=q.split(' ')[0]; }
        let lyrics='';
        try {
            const r = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`, {timeout:10000});
            lyrics = r.data?.lyrics;
        } catch {}
        if (!lyrics) return reply(sock, chatId, `❌ Lyrics not found for *${q}*\nTry: .lyrics Artist - Song`, message);
        const text = `🎵 *${title}*\n👤 *${artist}*\n${'─'.repeat(20)}\n\n${lyrics.trim().slice(0,3500)}\n\n_© ScottyMd by Scotty_`;
        await reply(sock, chatId, text, message);
    } catch(e) { await reply(sock, chatId, '❌ Lyrics search failed.', message); }
};
