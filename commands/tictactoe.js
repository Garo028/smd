const { getSender, reply } = require('./_helper');
const games = new Map();
function board(b) { const s={0:'⬜',1:'❌',2:'⭕'}; let r=''; for(let i=0;i<9;i+=3) r+=`${s[b[i]]}${s[b[i+1]]}${s[b[i+2]]}\n`; return r; }
function winner(b) { const w=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]; for(const[a,c,d]of w){if(b[a]&&b[a]===b[c]&&b[a]===b[d])return b[a];} return b.every(c=>c!==0)?'draw':null; }
module.exports = async (sock, chatId, message, args) => {
    const sender = getSender(sock, message);
    const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid||[];
    if (!games.has(chatId) || args[0]==='new') {
        if (!mentioned.length) return reply(sock, chatId, `🎮 *Tic Tac Toe*\n\nChallenge: .tictactoe @user\nMove: .tictactoe <1-9>\n\n1️⃣2️⃣3️⃣\n4️⃣5️⃣6️⃣\n7️⃣8️⃣9️⃣`, message);
        const opp = mentioned[0];
        games.set(chatId, { board:Array(9).fill(0), players:{1:sender,2:opp}, turn:1 });
        return await sock.sendMessage(chatId, { text: `🎮 *Tic Tac Toe!*\n❌ @${sender.split('@')[0]} vs ⭕ @${opp.split('@')[0]}\n\n${board(Array(9).fill(0))}\n❌ @${sender.split('@')[0]}'s turn! Pick 1-9`, mentions:[sender,opp] });
    }
    const pos = parseInt(args[0]);
    if (isNaN(pos)||pos<1||pos>9) return reply(sock, chatId, '❌ Pick 1-9', message);
    const g = games.get(chatId);
    const pn = g.players[1]===sender?1:g.players[2]===sender?2:null;
    if (!pn) return reply(sock, chatId, '❌ You are not in this game.', message);
    if (g.turn!==pn) return reply(sock, chatId, '❌ Not your turn!', message);
    if (g.board[pos-1]!==0) return reply(sock, chatId, '❌ Position taken!', message);
    g.board[pos-1]=pn; const w=winner(g.board);
    if (w==='draw') { games.delete(chatId); return reply(sock, chatId, `${board(g.board)}\n🤝 *Draw!*`, message); }
    if (w) { const wid=g.players[w]; games.delete(chatId); return await sock.sendMessage(chatId,{text:`${board(g.board)}\n🏆 *@${wid.split('@')[0]} wins!*`,mentions:[wid]}); }
    g.turn=pn===1?2:1; const next=g.players[g.turn]; const sym=g.turn===1?'❌':'⭕';
    await sock.sendMessage(chatId,{text:`${board(g.board)}\n${sym} @${next.split('@')[0]}'s turn! Pick 1-9`,mentions:[next]});
};
