export interface Category {
  id: string;
  name: string;
  emoji: string;
  language: 'es' | 'en' | 'es+en';
}

export interface Word {
  id: string;
  categoryId: string;
  text: string;
  language: 'es' | 'en';
}

export type WordStatus = 'correct' | 'skipped' | 'pending';

export interface RoundWord {
  word: Word;
  status: WordStatus;
}

export interface RoundResult {
  category: Category;
  score: number;
  totalPresented: number;
  words: RoundWord[];
}
