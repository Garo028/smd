const axios = require('axios');
const { reply } = require('./_helper');
module.exports = async (sock, chatId, message, args) => {
    try {
        const city = args.join(' ').trim();
        if (!city) return reply(sock, chatId, '❌ Usage: .weather <city>\nExample: .weather Harare', message);
        await reply(sock, chatId, `🌍 Fetching weather for *${city}*...`, message);
        const res = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`,{timeout:10000,headers:{'User-Agent':'curl/7.68.0'}});
        const c = res.data.current_condition[0];
        const e = ['sunny','clear'].some(x=>c.weatherDesc[0].value.toLowerCase().includes(x))?'☀️':['cloud'].some(x=>c.weatherDesc[0].value.toLowerCase().includes(x))?'☁️':['rain','drizzle'].some(x=>c.weatherDesc[0].value.toLowerCase().includes(x))?'🌧️':'🌡️';
        await reply(sock, chatId, `${e} *Weather in ${city}*\n\n🌡️ Temp: ${c.temp_C}°C / ${c.temp_F}°F\n🤔 Feels: ${c.FeelsLikeC}°C\n💧 Humidity: ${c.humidity}%\n💨 Wind: ${c.windspeedKmph} km/h\n🌤️ ${c.weatherDesc[0].value}\n\n_© ScottyMd by Scotty_`, message);
    } catch(e) { await reply(sock, chatId, `❌ Could not fetch weather for *${args.join(' ')}*.`, message); }
};
