const settings = require('../settings');
module.exports = async (sock, chatId, message) => {
    const menu = `╔══════════════════════════╗
║  🤖 *SCOTTYMD v2.0*
║  _© Scotty | 100 Commands_
╚══════════════════════════╝

┌─────⟪ CORE ⟫─────
│ ✦ .help / .menu
│ ✦ .ping / .alive / .uptime
│ ✦ .owner / .deviceinfo
│ ✦ .pair <number> / .session
└──────────────────

┌─────⟪ TOOLS ⟫─────
│ ✦ .weather <city>
│ ✦ .news <topic>
│ ✦ .wiki <topic>
│ ✦ .define / .urban <word>
│ ✦ .country / .github <n>
│ ✦ .currency <amt> <from> <to>
│ ✦ .calc / .qr / .tr / .tts
│ ✦ .remind <time> <msg>
│ ✦ .time / .age / .zodiac
│ ✦ .today / .encode / .decode
│ ✦ .reverse / .upper / .lower
│ ✦ .count / .password
└──────────────────

┌─────⟪ MEDIA ⟫─────
│ ✦ .sticker / .steal / .toimg
│ ✦ .play <song> / .lyrics
│ ✦ .vv / .getdp / .savestatus
│ ✦ .emojimix 😂🔥
└──────────────────

┌─────⟪ FUN ⟫─────
│ ✦ .joke / .dadjoke / .quote
│ ✦ .fact / .motivate / .today
│ ✦ .8ball / .truth / .dare
│ ✦ .roast / .ship / .love
│ ✦ .compliment / .insult / .rate
│ ✦ .flip / .dice / .choose
│ ✦ .tictactoe @user
│ ✦ .poll Q|opt1|opt2
│ ✦ .afk / .notes
│ ✦ .zodiac / .age / .urban
└──────────────────

┌─────⟪ GROUP ADMIN ⟫─────
│ ✦ .kick / .kickall
│ ✦ .promote / .demote
│ ✦ .mute / .unmute
│ ✦ .lock / .unlock
│ ✦ .warn / .warnings / .clearwarn
│ ✦ .del / .tagall / .hidetag
│ ✦ .announce / .welcome / .goodbye
│ ✦ .antilink / .antibadword / .antispam
│ ✦ .chatbot / .topmembers
│ ✦ .groupinfo / .admins / .whois
│ ✦ .getlink / .resetlink
│ ✦ .setname / .setdesc
└──────────────────

┌─────⟪ OWNER ⟫─────
│ ✦ .mode public/private
│ ✦ .alwaysonline on/off
│ ✦ .ban / .unban / .bc
│ ✦ .autoreply / .grouplist
│ ✦ .profile @user
└──────────────────

┌─────⟪ AI ⟫─────
│ ✦ .ai / .ask <question>
└──────────────────

_Prefix: *${settings.prefix}* | 100 commands_
_© ScottyMd v${settings.version} by Scotty_`;
    await sock.sendMessage(chatId, { text: menu }, { quoted: message });
};
