import { bot } from '../index';
import TelegramBot, { Message } from 'node-telegram-bot-api';

export const onTraining = (msg: Message): Promise<TelegramBot.Message> => {
  return bot.sendMessage(msg.chat.id, 'Training :)');
};
