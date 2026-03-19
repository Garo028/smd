const fs = require('fs');
const { reply, getSender } = require('./_helper');
const isOwner = require('../lib/isOwner');
const FILE = './data/notes.json';
function get() { try { return JSON.parse(fs.readFileSync(FILE,'utf8')); } catch { return {}; } }
function save(d) { fs.writeFileSync(FILE,JSON.stringify(d,null,2)); }
module.exports = async (sock, chatId, message, args) => {
    const d=get(); const sub=args[0]?.toLowerCase(); const sender=getSender(sock,message);
    if (!sub || sub==='list') {
        const userNotes=d[sender]||{};
        const keys=Object.keys(userNotes);
        if (!keys.length) return reply(sock,chatId,'📝 No notes saved.\n.notes save <name> <text>\n.notes get <name>\n.notes delete <name>',message);
        return reply(sock,chatId,`📝 *Your Notes (${keys.length})*\n\n${keys.map((k,i)=>`*${i+1}.* ${k}`).join('\n')}\n\nUse: .notes get <name>`,message);
    }
    if (sub==='save') {
        const name=args[1]; const text=args.slice(2).join(' ').trim();
        if (!name||!text) return reply(sock,chatId,'❌ Usage: .notes save <name> <text>',message);
        if (!d[sender]) d[sender]={};
        d[sender][name]=text; save(d);
        return reply(sock,chatId,`✅ Note *${name}* saved!`,message);
    }
    if (sub==='get') {
        const name=args[1]; if (!name) return reply(sock,chatId,'❌ Usage: .notes get <name>',message);
        const note=d[sender]?.[name];
        return reply(sock,chatId,note?`📝 *${name}*\n\n${note}`:`❌ Note *${name}* not found.`,message);
    }
    if (sub==='delete') {
        const name=args[1]; if (!name) return reply(sock,chatId,'❌ Usage: .notes delete <name>',message);
        if (!d[sender]?.[name]) return reply(sock,chatId,`❌ Note *${name}* not found.`,message);
        delete d[sender][name]; save(d);
        return reply(sock,chatId,`✅ Note *${name}* deleted.`,message);
    }
};
