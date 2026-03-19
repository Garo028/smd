/**
 * ScottyMd — Web Pairing Server
 * © ScottyMd by Scotty
 */
require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const path      = require('path');
const fs        = require('fs');
const chalk     = require('chalk');
const pino      = require('pino');
const NodeCache = require('node-cache');
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, DisconnectReason, delay } = require('@whiskeysockets/baileys');
const app     = express();
const PORT    = process.env.PORT || 8000;
const APP_URL = process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : process.env.APP_URL || `http://localhost:${PORT}`;
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
const sessions = new Map();
function keepAlive() {
    setInterval(async()=>{
        try{const fetch=require('node-fetch');await fetch(`${APP_URL}/ping`);console.log(chalk.cyan(`🏓 Keep-alive ping`));}catch{}
    },10*60*1000);
}
app.get('/ping',(req,res)=>res.json({status:'alive',bot:'ScottyMd',time:new Date().toISOString()}));
app.get('/',(req,res)=>res.sendFile(path.join(__dirname,'public','index.html')));
app.post('/pair',async(req,res)=>{
    let{phone}=req.body;
    if(!phone)return res.status(400).json({error:'Phone number is required.'});
    phone=phone.replace(/[^0-9]/g,'');
    if(phone.length<7||phone.length>15)return res.status(400).json({error:'Invalid number. Use international format without + (e.g. 263788114185)'});
    if(sessions.has(phone))return res.status(429).json({error:'Pairing already in progress. Please wait.'});
    sessions.set(phone,true);
    setTimeout(()=>sessions.delete(phone),120000);
    try{
        const dir=`./sessions/${phone}`;
        if(!fs.existsSync(dir))fs.mkdirSync(dir,{recursive:true});
        const{version}=await fetchLatestBaileysVersion();
        const{state,saveCreds}=await useMultiFileAuthState(dir);
        const sock=makeWASocket({version,logger:pino({level:'silent'}),printQRInTerminal:false,browser:['Ubuntu','Chrome','20.0.04'],auth:{creds:state.creds,keys:makeCacheableSignalKeyStore(state.keys,pino({level:'fatal'}).child({level:'fatal'}))},msgRetryCounterCache:new NodeCache(),connectTimeoutMs:60000,defaultQueryTimeoutMs:60000});
        sock.ev.on('creds.update',saveCreds);
        await delay(2000);
        let code;
        try{code=await sock.requestPairingCode(phone);code=code?.match(/.{1,4}/g)?.join('-')||code;}
        catch(err){sessions.delete(phone);try{sock.end();}catch{}return res.status(500).json({error:'Could not generate code. Ensure number is on WhatsApp.'});}
        sock.ev.on('connection.update',async(u)=>{
            if(u.connection==='open'){sessions.delete(phone);try{fs.writeFileSync(`${dir}/info.json`,JSON.stringify({phone,pairedAt:new Date().toISOString()},null,2));}catch{}await delay(3000);try{sock.end();}catch{}}
            if(u.connection==='close'){sessions.delete(phone);}
        });
        return res.json({success:true,code,message:'Enter this code in WhatsApp → Settings → Linked Devices → Link a Device → Link with phone number'});
    }catch(err){sessions.delete(phone);return res.status(500).json({error:'Something went wrong. Please try again.'});}
});
app.get('/status/:phone',(req,res)=>{
    const phone=req.params.phone.replace(/[^0-9]/g,'');
    const f=`./sessions/${phone}/info.json`;
    if(fs.existsSync(f)){const info=JSON.parse(fs.readFileSync(f,'utf8'));return res.json({paired:true,pairedAt:info.pairedAt});}
    res.json({paired:false,pending:sessions.has(phone)});
});
function startServer(){
    app.listen(PORT,'0.0.0.0',()=>{
        console.log(chalk.cyan(`\n🌐 ScottyMd Web Server → Port ${PORT}`));
        console.log(chalk.green(`🔗 ${APP_URL}\n`));
        keepAlive();
    });
}
module.exports={startServer};
