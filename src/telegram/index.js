import TelegramBot from'node-telegram-bot-api';
var botToken = '6493294406:AAGBOx9P1AShJwvL5G3EeZvS9TPAwLTMmNI'
const bot = new TelegramBot(botToken, { polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message
  
    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"
  
    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
  });

  bot.on('message', (msg) => {
    const chatId = msg.chat.id;
  
    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, 'Received your message');
  });





