export type QuestionType = 'MCQ' | 'Subjective';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Question {
  id: number;
  text: string;
  image?: string;
  type: QuestionType;
  subject: string;
  chapter: string;
  difficulty: Difficulty;
  options?: string[];
  correctAnswer: string;
}

export interface AnswerStatus {
  answer: string | null;
  isMarkedForReview: boolean;
  isVisited: boolean;
}
