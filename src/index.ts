import TelegramApi, { Message } from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { onStart } from './controllers/start';
import { COMMANDS, KEYBOARD, MESSAGE } from './helpers/constants';
import { onLearn } from './controllers/learn';
import { onTraining } from './controllers/training';
import { firebaseConfig } from './firebase/config';
import { initializeApp } from 'firebase/app';
import { onStatistic } from './controllers/statistic';

// Initialize Firebase
initializeApp(firebaseConfig);

// Initialize Bot
dotenv.config();
const token = process.env.TOKEN || '';
export const bot = new TelegramApi(token, { polling: true });

// Bot commands
bot.setMyCommands([
  { command: COMMANDS.START.PATH, description: COMMANDS.START.DESCRIPTION },
]);

// Bot on messages handlers
bot.on('message', async (msg: Message) => {
  const chatId = msg.chat.id;

  try {
    if (msg.text === COMMANDS.START.PATH) {
      return onStart(msg);
    }
    if (msg.text === KEYBOARD.LEARNING) {
      return onLearn(msg);
    }
    if (msg.text === KEYBOARD.TRAINING) {
      return onTraining(msg);
    }
    if (msg.text === KEYBOARD.STATISTIC) {
      return onStatistic(msg);
    }
  } catch (e) {
    return bot.sendMessage(chatId, MESSAGE.ERROR);
  }

  return bot.sendMessage(chatId, MESSAGE.HELLO);
});
