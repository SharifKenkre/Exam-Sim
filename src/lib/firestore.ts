import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { Question } from './types';

export async function getQuestions(): Promise<Question[]> {
  const questionsCol = collection(db, 'questions');
  const questionSnapshot = await getDocs(questionsCol);
  const questionList = questionSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: parseInt(doc.id, 10),
      text: data.text,
      type: data.type,
      subject: data.subject,
      chapter: data.chapter,
      difficulty: data.difficulty,
      options: data.options,
      correctAnswer: data.correctAnswer,
      image: data.image,
    } as Question;
  });
  return questionList;
}
