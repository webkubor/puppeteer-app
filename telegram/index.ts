const TelegramBot = require('node-telegram-bot-api');

var botToken = '6493294406:AAGBOx9P1AShJwvL5G3EeZvS9TPAwLTMmNI'
const bot = new TelegramBot(botToken, { polling: true});
let message = "出款额度恢复通知：   \n出款可用额度已恢复\n 代付已经可以正常使用\n以上通知，请您知晓。\n我们为带来的不便深感抱歉，请您见谅\n\n\nNotice of restoration of withdrawal limit:\nThe amount available for withdrawals has been restored\n- Withdrawal can be used normally. "
// MarkdownV2/HTML/Markdown格式
bot.on('message', (msg) => {
    console.log(`output->msg.chat`,msg)
    bot.sendMessage(msg.chat.id, '这是一条普通文本消息');
    bot.sendMessage(msg.chat.id, '<i>出款额度恢复通知：  \n出款额度恢复通知：</i>', { parse_mode: 'HTML' });
    bot.sendMessage(msg.chat.id, '<a href="https://core.telegram.org/bots/api?utm_source=botlist">链接：bot</a>', { parse_mode: 'HTML' });
    bot.sendMessage(msg.chat.id, '<b>链接：</b>\n<b>链接：</b>', { parse_mode: 'HTML' });
    bot.sendMessage(msg.chat.id, message, { parse_mode: 'HTML' });
});






