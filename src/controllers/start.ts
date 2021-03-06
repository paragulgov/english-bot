import { bot } from '../index';
import { Message } from 'node-telegram-bot-api';
import { keyboard_options } from '../helpers/keyboards';
import { child, get, getDatabase, ref, update } from 'firebase/database';
import { initialWords } from '../helpers/initialWords';
import { MESSAGE } from '../helpers/constants';

export const onStart = async (msg: Message) => {
  const db = getDatabase();
  const dbRef = ref(db);

  const userId = msg.from?.id;
  const chatId = msg.chat.id;

  if (userId) {
    get(child(dbRef, String(userId))).then((snapshot) => {
      if (snapshot.exists()) {
        return bot.sendMessage(chatId, MESSAGE.HELLO, keyboard_options);
      } else {
        let array = initialWords;

        for (let i = 0; i < 10; i++) {
          array = array.sort(() => Math.random() - 0.5)
        }

        update(dbRef, {
          [userId]: {
            words: array
          },
        }).then(() => {
          return bot.sendMessage(chatId, MESSAGE.HELLO, keyboard_options);
        });
      }
    }).catch((error) => {
      console.log(error);
      return bot.sendMessage(chatId, MESSAGE.ERROR);
    });
  }
};
