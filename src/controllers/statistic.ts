import { Message } from 'node-telegram-bot-api';
import { endAt, equalTo, get, getDatabase, orderByChild, query, ref, startAt } from 'firebase/database';
import { bot } from '../index';

export const onStatistic = async (msg: Message) => {
  const db = getDatabase();

  const userId = msg.from?.id;
  const chatId = msg.chat.id;

  if (userId) {
    let newWords = 0;
    let trainingWords = 0;
    let completedWords = 0;

    const newWordsQuery = query(ref(db, userId.toString() + '/words'), orderByChild('skill'), equalTo(0));
    const trainingWordsQuery = query(ref(db, userId.toString() + '/words'), orderByChild('skill'), startAt(1), endAt(4));
    const completedWordsQuery = query(ref(db, userId.toString() + '/words'), orderByChild('skill'), equalTo(5));

    await get(newWordsQuery).then((snapshot) => {
      newWords = snapshot.size;
    });

    await get(trainingWordsQuery).then((snapshot) => {
      trainingWords = snapshot.size;
    });

    await get(completedWordsQuery).then((snapshot) => {
      completedWords = snapshot.size;
    });

    const str = `Слов выучено - ${completedWords} \nСлов предстоит выучить - ${newWords} \nСлов для тренировки - ${trainingWords}`

    return bot.sendMessage(chatId, str);
  }
};
