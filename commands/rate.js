const { reply } = require('./_helper');
module.exports = async (sock, chatId, message, args) => {
    const thing = args.join(' ').trim();
    if (!thing) return reply(sock, chatId, '❌ Usage: .rate <anything>', message);
    let hash=0; for(const c of thing.toLowerCase()) hash=((hash<<5)-hash)+c.charCodeAt(0);
    const score=Math.abs(hash)%11; const bar='█'.repeat(score)+'░'.repeat(10-score);
    const emoji=score>=8?'🔥':score>=5?'👍':'😐';
    await reply(sock, chatId, `${emoji} *Rating: ${thing}*\n\n${bar} *${score}/10*\n\n_© ScottyMd by Scotty_`, message);
};
