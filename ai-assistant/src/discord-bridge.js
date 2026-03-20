import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';

const token = process.env.DISCORD_BOT_TOKEN;
const channelId = process.env.DISCORD_CHANNEL_ID || '1480156454424940635';
const askUrl = process.env.ASK_URL || 'http://127.0.0.1:8787/ask';

if (!token) {
  console.error('Missing DISCORD_BOT_TOKEN');
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('ready', () => {
  console.log(`discord bridge ready: ${client.user.tag}`);
});

client.on('messageCreate', async (msg) => {
  try {
    if (msg.author.bot) return;
    if (msg.channelId !== channelId) return;
    const text = (msg.content || '').trim();
    if (!text) return;

    await msg.channel.sendTyping();
    const r = await fetch(askUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ question: text })
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'ask failed');

    const refs = (data.references || [])
      .map((x, i) => `${i + 1}) [${x.source_type}] ${x.title || x.source_id}`)
      .join('\n');

    await msg.reply(`${data.answer}\n\n参考：\n${refs || '（暂无）'}`);
  } catch (e) {
    await msg.reply(`处理失败：${e.message}`);
  }
});

client.login(token);
