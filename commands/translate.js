const axios = require('axios');
const { reply } = require('./_helper');
module.exports = async (sock, chatId, message, args) => {
    try {
        if (args.length < 2) {
            const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const qtxt   = quoted?.conversation || quoted?.extendedTextMessage?.text;
            if (qtxt && args.length >= 1) {
                const lang = args[0]; const r = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(qtxt)}`,{timeout:10000});
                let out=''; r.data[0].forEach(c=>{if(c[0])out+=c[0];}); const from=r.data[2]||'auto';
                return reply(sock, chatId, `🌐 *Translation*\nFrom: ${from.toUpperCase()} → ${lang.toUpperCase()}\n\n${out}\n\n_© ScottyMd by Scotty_`, message);
            }
            return reply(sock, chatId, '❌ Usage: .tr <lang> <text>\nOr reply to a message: .tr en\n\nCodes: en es fr de pt ar zh ja hi sw', message);
        }
        const lang = args[0]; const text = args.slice(1).join(' ');
        await reply(sock, chatId, '🌐 Translating...', message);
        const r = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`,{timeout:10000});
        let out=''; r.data[0].forEach(c=>{if(c[0])out+=c[0];}); const from=r.data[2]||'auto';
        await reply(sock, chatId, `🌐 *Translation*\nFrom: ${from.toUpperCase()} → ${lang.toUpperCase()}\n\n*Original:* ${text}\n\n*Translated:* ${out}\n\n_© ScottyMd by Scotty_`, message);
    } catch(e) { await reply(sock, chatId, '❌ Translation failed.', message); }
};
