/**
 * ScottyMd — Main Message Handler
 * Routes all 100 commands
 * © ScottyMd by Scotty
 */
const fs   = require('fs');
const path = require('path');
const settings  = require('./settings');
const { isBanned } = require('./lib/isBanned');
const { getSender } = require('./lib/getSender');

const tempDir = path.join(process.cwd(), 'temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir,{recursive:true});
process.env.TMPDIR=tempDir; process.env.TEMP=tempDir; process.env.TMP=tempDir;
setInterval(()=>{fs.readdir(tempDir,(err,files)=>{if(err)return;files.forEach(f=>{const fp=path.join(tempDir,f);fs.stat(fp,(e,s)=>{if(!e&&Date.now()-s.mtimeMs>3*60*60*1000)fs.unlink(fp,()=>{});});});});},3*60*60*1000);

const helpCmd=require('./commands/help'),pingCmd=require('./commands/ping'),aliveCmd=require('./commands/alive'),uptimeCmd=require('./commands/uptime'),ownerCmd=require('./commands/owner'),deviceCmd=require('./commands/deviceinfo'),pairCmd=require('./commands/pair'),sessionCmd=require('./commands/session');
const weatherCmd=require('./commands/weather'),newsCmd=require('./commands/news'),wikiCmd=require('./commands/wiki'),defineCmd=require('./commands/define'),urbanCmd=require('./commands/urban'),countryCmd=require('./commands/country'),githubCmd=require('./commands/github'),currencyCmd=require('./commands/currency'),calcCmd=require('./commands/calc'),qrCmd=require('./commands/qr'),trCmd=require('./commands/translate'),ttsCmd=require('./commands/tts'),remindCmd=require('./commands/remind'),timeCmd=require('./commands/time'),ageCmd=require('./commands/age'),zodiacCmd=require('./commands/zodiac'),todayCmd=require('./commands/today'),encodeCmd=require('./commands/encode'),decodeCmd=require('./commands/decode'),reverseCmd=require('./commands/reverse'),upperCmd=require('./commands/upper'),lowerCmd=require('./commands/lower'),countCmd=require('./commands/count'),passCmd=require('./commands/password');
const stickerCmd=require('./commands/sticker'),stealCmd=require('./commands/steal'),toimgCmd=require('./commands/toimg'),playCmd=require('./commands/play'),lyricsCmd=require('./commands/lyrics'),vvCmd=require('./commands/vv'),getDpCmd=require('./commands/getdp'),saveStatusCmd=require('./commands/savestatus'),emojimixCmd=require('./commands/emojimix');
const jokeCmd=require('./commands/joke'),dadjokCmd=require('./commands/dadjoke'),quoteCmd=require('./commands/quote'),factCmd=require('./commands/fact'),motivateCmd=require('./commands/motivate'),eightballCmd=require('./commands/eightball'),truthCmd=require('./commands/truth'),dareCmd=require('./commands/dare'),roastCmd=require('./commands/roast'),shipCmd=require('./commands/ship'),loveCmd=require('./commands/love'),complimentCmd=require('./commands/compliment'),insultCmd=require('./commands/insult'),rateCmd=require('./commands/rate'),flipCmd=require('./commands/flip'),diceCmd=require('./commands/dice'),chooseCmd=require('./commands/choose'),tictactoeCmd=require('./commands/tictactoe'),pollCmd=require('./commands/poll'),notesCmd=require('./commands/notes');
const {afkCommand,checkAfk,clearAfk}=require('./commands/afk');
const kickCmd=require('./commands/kick'),kickallCmd=require('./commands/kickall'),promoteCmd=require('./commands/promote'),demoteCmd=require('./commands/demote'),muteCmd=require('./commands/mute'),unmuteCmd=require('./commands/unmute'),lockCmd=require('./commands/lock'),unlockCmd=require('./commands/unlock'),warnCmd=require('./commands/warn'),warningsCmd=require('./commands/warnings'),clearwarnCmd=require('./commands/clearwarn'),delCmd=require('./commands/del'),tagallCmd=require('./commands/tagall'),hidetagCmd=require('./commands/hidetag'),announceCmd=require('./commands/announce');
const {welcomeCommand,handleJoin}=require('./commands/welcome'),{goodbyeCommand,handleLeave}=require('./commands/goodbye'),{antilinkCommand,handleLink}=require('./commands/antilink'),{antibadwordCommand,handleBadword}=require('./commands/antibadword'),{antispamCommand,handleSpam}=require('./commands/antispam'),{chatbotCommand,handleChatbot}=require('./commands/chatbot'),{topMembersCommand,inc}=require('./commands/topmembers');
const groupinfoCmd=require('./commands/groupinfo'),adminsCmd=require('./commands/admins'),whoisCmd=require('./commands/whois'),getlinkCmd=require('./commands/getlink'),resetlinkCmd=require('./commands/resetlink'),setnameCmd=require('./commands/setname'),setdescCmd=require('./commands/setdesc');
const {modeCommand,getMode}=require('./commands/mode'),{alwaysOnlineCommand,initAlwaysOnline}=require('./commands/alwaysonline'),banCmd=require('./commands/ban'),unbanCmd=require('./commands/unban'),{bcCommand,addUser}=require('./commands/bc'),{autoReplyCommand,handleAutoReply}=require('./commands/autoreply'),grouplistCmd=require('./commands/grouplist'),profileCmd=require('./commands/profile'),aiCmd=require('./commands/ai');
global.initAlwaysOnline=initAlwaysOnline;

async function handleMessages(sock, update) {
    try {
        const {messages,type}=update; if(type!=='notify')return;
        const message=messages[0]; if(!message?.message)return;
        if(Object.keys(message.message)[0]==='ephemeralMessage') message.message=message.message.ephemeralMessage.message;
        const chatId=message.key.remoteJid,isGroup=chatId?.endsWith('@g.us'),senderId=getSender(sock,message);
        if(!chatId||!senderId)return; if(chatId==='status@broadcast')return; if(isBanned(senderId))return;
        if(!isGroup&&!message.key.fromMe) await handleAutoReply(sock,message);
        try{const afk=checkAfk(senderId);if(afk){clearAfk(senderId);await sock.sendMessage(chatId,{text:`👋 Welcome back @${senderId.split('@')[0]}! AFK for ${Math.round((Date.now()-afk.time)/60000)}min.`,mentions:[senderId]});}}catch{}
        if(!isGroup) addUser(senderId);
        if(isGroup){inc(chatId,senderId);await handleLink(sock,chatId,message);await handleBadword(sock,chatId,message);await handleSpam(sock,chatId,message,senderId);}
        const rawText=message.message?.conversation||message.message?.extendedTextMessage?.text||message.message?.imageMessage?.caption||message.message?.videoMessage?.caption||message.message?.buttonsResponseMessage?.selectedButtonId||message.message?.listResponseMessage?.singleSelectReply?.selectedRowId||'';
        const prefix=settings.prefix||'.', lower=rawText.trim().toLowerCase();
        if(!lower.startsWith(prefix)){if(rawText)await handleChatbot(sock,chatId,message,rawText);return;}
        const[cmd]=lower.slice(prefix.length).split(/\s+/);
        const args=rawText.trim().slice(prefix.length).split(/\s+/).slice(1);
        switch(cmd){
            case'help':case'menu':await helpCmd(sock,chatId,message);break;
            case'ping':await pingCmd(sock,chatId,message);break;
            case'alive':await aliveCmd(sock,chatId,message);break;
            case'uptime':await uptimeCmd(sock,chatId,message);break;
            case'owner':await ownerCmd(sock,chatId,message);break;
            case'deviceinfo':case'sysinfo':await deviceCmd(sock,chatId,message);break;
            case'pair':await pairCmd(sock,chatId,message,args);break;
            case'session':await sessionCmd(sock,chatId,message);break;
            case'weather':await weatherCmd(sock,chatId,message,args);break;
            case'news':await newsCmd(sock,chatId,message,args);break;
            case'wiki':case'wikipedia':await wikiCmd(sock,chatId,message,args);break;
            case'define':case'dictionary':await defineCmd(sock,chatId,message,args);break;
            case'urban':await urbanCmd(sock,chatId,message,args);break;
            case'country':await countryCmd(sock,chatId,message,args);break;
            case'github':case'gh':await githubCmd(sock,chatId,message,args);break;
            case'currency':case'convert':await currencyCmd(sock,chatId,message,args);break;
            case'calc':case'math':await calcCmd(sock,chatId,message,args);break;
            case'qr':case'qrcode':await qrCmd(sock,chatId,message,args);break;
            case'tr':case'translate':await trCmd(sock,chatId,message,args);break;
            case'tts':await ttsCmd(sock,chatId,message,args);break;
            case'remind':await remindCmd(sock,chatId,message,args);break;
            case'time':await timeCmd(sock,chatId,message,args);break;
            case'age':await ageCmd(sock,chatId,message,args);break;
            case'zodiac':await zodiacCmd(sock,chatId,message,args);break;
            case'today':await todayCmd(sock,chatId,message);break;
            case'encode':await encodeCmd(sock,chatId,message,args);break;
            case'decode':await decodeCmd(sock,chatId,message,args);break;
            case'reverse':await reverseCmd(sock,chatId,message,args);break;
            case'upper':case'uppercase':await upperCmd(sock,chatId,message,args);break;
            case'lower':case'lowercase':await lowerCmd(sock,chatId,message,args);break;
            case'count':await countCmd(sock,chatId,message,args);break;
            case'password':case'pass':await passCmd(sock,chatId,message,args);break;
            case'sticker':case's':await stickerCmd(sock,chatId,message);break;
            case'steal':await stealCmd(sock,chatId,message,args);break;
            case'toimg':case'tovid':await toimgCmd(sock,chatId,message);break;
            case'play':await playCmd(sock,chatId,message,args);break;
            case'lyrics':case'lyric':await lyricsCmd(sock,chatId,message,args);break;
            case'vv':case'viewonce':await vvCmd(sock,chatId,message);break;
            case'getdp':case'dp':await getDpCmd(sock,chatId,message);break;
            case'savestatus':case'statusdown':await saveStatusCmd(sock,chatId,message);break;
            case'emojimix':await emojimixCmd(sock,chatId,message,args);break;
            case'joke':case'jokes':await jokeCmd(sock,chatId,message);break;
            case'dadjoke':await dadjokCmd(sock,chatId,message);break;
            case'quote':await quoteCmd(sock,chatId,message);break;
            case'fact':await factCmd(sock,chatId,message);break;
            case'motivate':case'inspire':await motivateCmd(sock,chatId,message);break;
            case'8ball':await eightballCmd(sock,chatId,message,args);break;
            case'truth':await truthCmd(sock,chatId,message);break;
            case'dare':await dareCmd(sock,chatId,message);break;
            case'roast':await roastCmd(sock,chatId,message);break;
            case'ship':await shipCmd(sock,chatId,message);break;
            case'love':await loveCmd(sock,chatId,message,args);break;
            case'compliment':case'praise':await complimentCmd(sock,chatId,message);break;
            case'insult':case'burn':await insultCmd(sock,chatId,message);break;
            case'rate':await rateCmd(sock,chatId,message,args);break;
            case'flip':case'coin':await flipCmd(sock,chatId,message);break;
            case'dice':case'roll':await diceCmd(sock,chatId,message,args);break;
            case'choose':case'pick':await chooseCmd(sock,chatId,message,args);break;
            case'tictactoe':case'ttt':await tictactoeCmd(sock,chatId,message,args);break;
            case'poll':await pollCmd(sock,chatId,message,args);break;
            case'afk':await afkCommand(sock,chatId,message,args);break;
            case'notes':await notesCmd(sock,chatId,message,args);break;
            case'kick':case'remove':await kickCmd(sock,chatId,message);break;
            case'kickall':await kickallCmd(sock,chatId,message);break;
            case'promote':await promoteCmd(sock,chatId,message);break;
            case'demote':await demoteCmd(sock,chatId,message);break;
            case'mute':await muteCmd(sock,chatId,message);break;
            case'unmute':await unmuteCmd(sock,chatId,message);break;
            case'lock':await lockCmd(sock,chatId,message);break;
            case'unlock':await unlockCmd(sock,chatId,message);break;
            case'warn':await warnCmd(sock,chatId,message);break;
            case'warnings':case'warnlist':await warningsCmd(sock,chatId,message);break;
            case'clearwarn':case'resetwarn':await clearwarnCmd(sock,chatId,message);break;
            case'del':case'delete':await delCmd(sock,chatId,message);break;
            case'tagall':case'everyone':await tagallCmd(sock,chatId,message,args);break;
            case'hidetag':case'ht':await hidetagCmd(sock,chatId,message,args);break;
            case'announce':await announceCmd(sock,chatId,message,args);break;
            case'welcome':await welcomeCommand(sock,chatId,message,args);break;
            case'goodbye':case'bye':await goodbyeCommand(sock,chatId,message,args);break;
            case'antilink':await antilinkCommand(sock,chatId,message,args);break;
            case'antibadword':case'abw':await antibadwordCommand(sock,chatId,message,args);break;
            case'antispam':await antispamCommand(sock,chatId,message,args);break;
            case'chatbot':case'cb':await chatbotCommand(sock,chatId,message,args);break;
            case'topmembers':case'ranking':await topMembersCommand(sock,chatId,message);break;
            case'groupinfo':case'ginfo':await groupinfoCmd(sock,chatId,message);break;
            case'admins':case'staff':await adminsCmd(sock,chatId,message);break;
            case'whois':await whoisCmd(sock,chatId,message);break;
            case'getlink':case'invitelink':await getlinkCmd(sock,chatId,message);break;
            case'resetlink':case'revoke':await resetlinkCmd(sock,chatId,message);break;
            case'setname':await setnameCmd(sock,chatId,message,args);break;
            case'setdesc':await setdescCmd(sock,chatId,message,args);break;
            case'mode':await modeCommand(sock,chatId,message,args);break;
            case'alwaysonline':case'ao':await alwaysOnlineCommand(sock,chatId,message,args);break;
            case'ban':await banCmd(sock,chatId,message);break;
            case'unban':await unbanCmd(sock,chatId,message);break;
            case'bc':case'broadcast':await bcCommand(sock,chatId,message,args);break;
            case'autoreply':case'ar':await autoReplyCommand(sock,chatId,message,args);break;
            case'grouplist':case'groups':await grouplistCmd(sock,chatId,message);break;
            case'profile':case'pp':await profileCmd(sock,chatId,message);break;
            case'ai':case'ask':case'gpt':await aiCmd(sock,chatId,message,args);break;
            default:break;
        }
    } catch(e){ console.error('handleMessages error:',e.message); }
}

async function handleGroupParticipantUpdate(sock,update){
    try{const{id,participants,action}=update;if(!id.endsWith('@g.us'))return;if(action==='add')await handleJoin(sock,id,participants);if(action==='remove')await handleLeave(sock,id,participants);}catch(e){console.error('group update error:',e.message);}
}

async function handleStatus(){}

module.exports={handleMessages,handleGroupParticipantUpdate,handleStatus};
