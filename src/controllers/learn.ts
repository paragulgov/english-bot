import { bot } from '../index';
import { CallbackQuery, Message } from 'node-telegram-bot-api';
import { learn_inline_keyboard_options } from '../helpers/keyboards';
import { equalTo, get, getDatabase, limitToFirst, orderByChild, query, ref, update } from 'firebase/database';
import { WordType } from '../types/types';
import { INLINE_KEYBOARD } from '../helpers/constants';

export const onLearn = async (msg: Message) => {
  const db = getDatabase();

  const chatId = msg.chat.id;
  const userId = msg.from?.id;

  if (userId) {
    const que = query(ref(db, userId.toString() + '/words'), orderByChild('skill'), equalTo(0), limitToFirst(10));

    get(que)
      .then((snapshot) => {
        if (snapshot.exists()) {
          let arrWords: WordType[] = [];
          let arrIds: number[] = [];

          snapshot.forEach(el => {
            if (el.key !== null) {
              const id = +el.key as number;
              const value = el.val() as WordType;

              arrWords.push(value);
              arrIds.push(id);
            }
          });

          let strMessage = '';

          arrWords.forEach(el => strMessage += `${el.en} - ${el.ru} \n`);

          bot.sendMessage(msg.chat.id, strMessage, learn_inline_keyboard_options);

          bot.on('callback_query', async (query: CallbackQuery) => {
            const data = query.data;

            if (chatId) {
              if (data === INLINE_KEYBOARD.LEARNED.CALLBACK_DATA && arrIds.length > 0 && arrWords.length > 0) {
                arrIds.forEach(el => {
                  update(ref(db, userId.toString() + '/words/' + el), {
                    skill: 1,
                  })
                    .then(() => {
                      arrWords = []
                      arrIds = []
                    });
                });

                return bot.sendMessage(chatId, 'Now you can practice these words');
              }
            }
          });
        } else {
          return bot.sendMessage(chatId, 'You have no new words');
        }
      })
      .catch((error) => {
        // TODO
        console.log(error);
        return bot.sendMessage(chatId, 'Error. Try later :(');
      });
  }
};
