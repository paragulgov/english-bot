import { get, getDatabase, orderByChild, query, ref } from 'firebase/database';
import { getRandomNumber } from './getRandomNumber';

export const getRandomWords = async (userId: string | number, exclude: string) => {
  const db = getDatabase();

  const allWordsQuery = query(ref(db, userId.toString() + '/words'), orderByChild('skill'));

  return await get(allWordsQuery).then(snapshot => {
    if (snapshot.exists()) {
      let allWords: string[] = [];

      snapshot.forEach(el => {
        if (el.val().ru !== exclude) {
          allWords.push(el.val().ru);
        }
      });

      let randomIndexes: number[] = [];

      for (let i = 0; i < 10; i++) {
        const randomNumber = getRandomNumber(0, allWords.length - 1)
        if (!randomIndexes.includes(randomNumber)) {
          randomIndexes.push(randomNumber);
        }
      }

      const word1 = allWords[randomIndexes[0]]
      const word2 = allWords[randomIndexes[1]]
      const word3 = allWords[randomIndexes[2]]

      return { word1, word2, word3 }
    }
  });
};