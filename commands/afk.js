const { reply, getSender } = require('./_helper');
const afkMap = new Map();
async function afkCommand(sock, chatId, message, args) {
    const sender = getSender(sock, message);
    const reason = args.join(' ') || 'AFK';
    afkMap.set(sender, { reason, time: Date.now() });
    await sock.sendMessage(chatId,{text:`😴 @${sender.split('@')[0]} is now *AFK*\nReason: ${reason}\n\n_© ScottyMd by Scotty_`,mentions:[sender]},{quoted:message});
}
function checkAfk(sender) { return afkMap.get(sender)||null; }
function clearAfk(sender) { afkMap.delete(sender); }
module.exports = { afkCommand, checkAfk, clearAfk };
