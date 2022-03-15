import { SendMessageOptions } from 'node-telegram-bot-api';
import { INLINE_KEYBOARD, KEYBOARD } from './constants';

export const keyboard_options: SendMessageOptions = {
  reply_markup: {
    keyboard: [
      [{ text: KEYBOARD.LEARNING }],
      [{ text: KEYBOARD.TRAINING }],
      [{ text: KEYBOARD.STATISTIC }],
    ],
  },
};

export const learn_inline_keyboard_options: SendMessageOptions = {
  reply_markup: {
    inline_keyboard: [
      [{ text: INLINE_KEYBOARD.LEARNED.TEXT, callback_data: INLINE_KEYBOARD.LEARNED.CALLBACK_DATA }],
    ],
  },
};