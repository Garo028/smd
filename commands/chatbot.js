const fs  = require('fs');
const axios = require('axios');
const { checkAdmin, reply } = require('./_helper');
const FILE = './data/chatbot.json';
function get() { try { return JSON.parse(fs.readFileSync(FILE,'utf8')); } catch { return {}; } }
function save(d) { fs.writeFileSync(FILE,JSON.stringify(d,null,2)); }
async function chatbotCommand(sock, chatId, message, args) {
    if (!await checkAdmin(sock, chatId, message)) return reply(sock, chatId, '❌ Admins only.', message);
    const d=get(); const sub=args[0]?.toLowerCase();
    if (!sub) return reply(sock,chatId,`🤖 *Chatbot*\nStatus: ${d[chatId]?.enabled?'✅ ON':'❌ OFF'}\n\n.chatbot on\n.chatbot off`,message);
    if (sub==='on')  { d[chatId]={enabled:true};  save(d); return reply(sock,chatId,'🤖 Chatbot enabled!',message); }
    if (sub==='off') { d[chatId]={enabled:false}; save(d); return reply(sock,chatId,'❌ Chatbot disabled.',message); }
}
async function handleChatbot(sock, chatId, message, text) {
    try {
        const d=get(); if(!d[chatId]?.enabled) return;
        if (!text||text.startsWith('.')) return;
        const res=await axios.post('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
            {inputs:`<s>[INST] ${text} [/INST]`,parameters:{max_new_tokens:150,temperature:0.7,return_full_text:false}},
            {headers:{'Content-Type':'application/json'},timeout:20000});
        let ans=(Array.isArray(res.data)?res.data[0]?.generated_text:res.data?.generated_text)||'';
        ans=ans.replace(/<\/?s>/g,'').replace(/\[INST\]|\[\/INST\]/g,'').trim();
        if (ans) await sock.sendMessage(chatId,{text:ans},{quoted:message});
    } catch {}
}
module.exports = { chatbotCommand, handleChatbot };
