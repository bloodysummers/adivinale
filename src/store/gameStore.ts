import { create } from 'zustand';
import type { Category, Word } from '../types';
import { shuffle } from '../utils/shuffle';

export type GameStatus = 'idle' | 'countdown' | 'playing' | 'finished';

interface GameState {
  category: Category | null;
  words: Word[];
  currentIndex: number;
  score: number;
  status: GameStatus;
  startRound: (category: Category, words: Word[]) => void;
  markCorrect: () => void;
  markSkipped: () => void;
  endRound: () => void;
  resetRound: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  category: null,
  words: [],
  currentIndex: 0,
  score: 0,
  status: 'idle',

  startRound: (category, words) => {
    set({
      category,
      words: shuffle(words),
      currentIndex: 0,
      score: 0,
      status: 'playing',
    });
  },

  markCorrect: () => {
    const { currentIndex, words, score } = get();
    const nextIndex = currentIndex + 1;
    if (nextIndex >= words.length) {
      set({ score: score + 1, currentIndex: nextIndex, status: 'finished' });
    } else {
      set({ score: score + 1, currentIndex: nextIndex });
    }
  },

  markSkipped: () => {
    const { currentIndex, words } = get();
    const nextIndex = currentIndex + 1;
    if (nextIndex >= words.length) {
      set({ currentIndex: nextIndex, status: 'finished' });
    } else {
      set({ currentIndex: nextIndex });
    }
  },

  endRound: () => set({ status: 'finished' }),

  resetRound: () =>
    set({
      words: [],
      currentIndex: 0,
      score: 0,
      status: 'idle',
    }),
}));
