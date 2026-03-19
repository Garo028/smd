/**
 * ScottyMd — Command Helper
 * Shared utilities for all commands
 * © ScottyMd by Scotty
 */
const isAdmin   = require('../lib/isAdmin');
const isOwner   = require('../lib/isOwner');
const { getSender, getBotJid } = require('../lib/getSender');

// Check if sender is admin or owner
async function checkAdmin(sock, chatId, message) {
    const sender = getSender(sock, message);
    if (isOwner(sender)) return true;
    if (chatId.endsWith('@g.us')) return await isAdmin(sock, chatId, sender);
    return false;
}

// Check if bot is admin in group
async function checkBotAdmin(sock, chatId) {
    if (!chatId.endsWith('@g.us')) return false;
    return await isAdmin.isBotAdmin(sock, chatId);
}

// Get mentioned users or quoted participant
function getMentioned(message) {
    const mentioned = [...(message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [])];
    const qp = message.message?.extendedTextMessage?.contextInfo?.participant;
    if (qp && !mentioned.includes(qp)) mentioned.push(qp);
    return mentioned;
}

// Reply helper
async function reply(sock, chatId, text, message) {
    return sock.sendMessage(chatId, { text }, message ? { quoted: message } : {});
}

module.exports = { checkAdmin, checkBotAdmin, getMentioned, reply, getSender, getBotJid, isAdmin, isOwner };
