import { bot } from '../index';
import { CallbackQuery, Message } from 'node-telegram-bot-api';
import { child, endAt, get, getDatabase, orderByChild, query, ref, startAt, update } from 'firebase/database';
import { getRandomWords } from '../helpers/getRandomWords';
import { getRandomNumber } from '../helpers/getRandomNumber';
import { MESSAGE } from '../helpers/constants';

export const onTraining = (msg: Message) => {
  const db = getDatabase();

  const chatId = msg.chat.id;
  const userId = msg.from?.id;

  if (userId) {
    const wordsAvailableTrainingQuery = query(ref(db, userId.toString() + '/words'), orderByChild('skill'), startAt(1), endAt(4));

    get(wordsAvailableTrainingQuery).then((snapshot) => {
      if (snapshot.exists()) {
        let wordsIdsArray: number[] = [];

        snapshot.forEach(el => {
          if (el.key !== null) {
            wordsIdsArray.push(+el.key);
          }
        });

        let randomWordIndex: number = getRandomNumber(0, wordsIdsArray.length - 1);
        let randomWordId: number | null = wordsIdsArray[randomWordIndex];

        get(child(ref(db), userId.toString() + '/words/' + randomWordId))
          .then(async (snapshot) => {
            if (snapshot.exists() && randomWordId) {
              const fakeWords = await getRandomWords(userId, snapshot.val().ru);

              if (fakeWords) {
                const reply_markup = {
                  inline_keyboard: [
                    [{ text: fakeWords.word1, callback_data: 'err#$' }],
                    [{ text: snapshot.val().ru, callback_data: randomWordId.toString() }],
                    [{ text: fakeWords.word2, callback_data: 'err#$' }],
                    [{ text: fakeWords.word3, callback_data: 'err#$' }],
                  ],
                };

                bot.sendMessage(chatId, snapshot.val().en, { reply_markup });
              }

              bot.on('callback_query', async (query: CallbackQuery) => {
                const data = query.data;

                if (chatId) {
                  if (data === snapshot.key) {
                    if (randomWordId) {
                      update(ref(db, userId.toString() + '/words/' + randomWordId), {
                        skill: +snapshot.val().skill + 1,
                      })
                        .then(() => {
                          randomWordId = null;
                        });

                      return bot.sendMessage(chatId, 'Правильно!');
                    }
                  } else {
                    if (randomWordId) {
                      update(ref(db, userId.toString() + '/words/' + randomWordId), {
                        skill: +snapshot.val().skill - 1,
                      })
                        .then(() => {
                          randomWordId = null;
                        });

                      return bot.sendMessage(chatId, 'Ответ неверный. Правильно будет: ' + snapshot.val().ru);
                    }
                  }
                }
              });
            }
          })
          .catch((error) => {
            console.error(error);
          });

      } else {
        return bot.sendMessage(chatId, 'У тебя нет слов для тренировки. Ты все знаешь!');
      }
    }).catch(err => {
      console.log(err);
      return bot.sendMessage(chatId, MESSAGE.ERROR);
    });
  }
};
