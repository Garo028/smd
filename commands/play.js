const yts  = require('yt-search');
const ytdl = require('ytdl-core');
const fs   = require('fs');
const path = require('path');
const { reply } = require('./_helper');
module.exports = async (sock, chatId, message, args) => {
    try {
        const q = args.join(' ').trim();
        if (!q) return reply(sock, chatId, '❌ Usage: .play <song name>', message);
        await reply(sock, chatId, `🔍 Searching: *${q}*...`, message);
        const res = await yts(q);
        const vid = res.videos[0];
        if (!vid) return reply(sock, chatId, '❌ No results found.', message);
        if (vid.duration.seconds > 600) return reply(sock, chatId, '❌ Song too long (max 10 min).', message);
        await reply(sock, chatId, `🎵 *${vid.title}*\n⏱️ ${vid.timestamp}\n⬇️ Downloading...`, message);
        const tmp = path.join('./temp', `play_${Date.now()}.mp3`);
        await new Promise((res, rej) => {
            ytdl(vid.url, { filter:'audioonly', quality:'highestaudio' })
                .pipe(fs.createWriteStream(tmp))
                .on('finish', res).on('error', rej);
        });
        await sock.sendMessage(chatId, { audio: fs.readFileSync(tmp), mimetype: 'audio/mpeg', fileName: `${vid.title}.mp3` }, { quoted: message });
        try { fs.unlinkSync(tmp); } catch {}
    } catch(e) { await reply(sock, chatId, '❌ Download failed. Try again.', message); }
};
