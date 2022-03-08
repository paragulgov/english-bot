import TelegramApi, { Message, SendMessageOptions, CallbackQuery } from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();
const token = process.env.TOKEN || '';

const bot = new TelegramApi(token, { polling: true });

bot.setMyCommands([
  { command: '/start', description: 'Start' },
]);

const keyboard_options: SendMessageOptions = {
  reply_markup: {
    keyboard: [
      [{ text: 'Keyboard button' }],
    ],
  },
};

const inline_keyboard_options: SendMessageOptions = {
  reply_markup: {
    inline_keyboard: [
      [{ text: 'Inline button', callback_data: 'inline_button' }],
    ],
  },
};

bot.on('message', async (msg: Message) => {
  const chatId = msg.chat.id;

  try {
    if (msg.text === '/start') {
      return bot.sendMessage(chatId, 'Hello', keyboard_options);
    }
    if (msg.text === 'Keyboard button') {
      return bot.sendMessage(chatId, 'Keyboard button clicked', inline_keyboard_options);
    }
  } catch (e) {
    return bot.sendMessage(chatId, 'Error :(');
  }

  return bot.sendMessage(chatId, 'Invalid value');

});

bot.on('callback_query', async (msg: CallbackQuery) => {
  const chatId = msg.message?.chat.id;
  const data = msg.data;

  if (chatId) {
    if (data === 'inline_button') {
      return bot.sendMessage(chatId, 'Inline button clicked');
    }
  }
});