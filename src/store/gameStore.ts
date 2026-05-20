import { create } from 'zustand';
import type { Category, RoundWord, Word } from '../types';
import { shuffle } from '../utils/shuffle';

export type GameStatus = 'idle' | 'countdown' | 'playing' | 'finished';
export type GameMode = 'clasico' | 'equipos';

interface GameState {
  category: Category | null;
  words: Word[];
  currentIndex: number;
  score: number;
  status: GameStatus;
  playedWords: RoundWord[];
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
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
  playedWords: [],
  gameMode: 'clasico',
  setGameMode: (mode) => set({ gameMode: mode }),

  startRound: (category, words) => {
    set({
      category,
      words: shuffle(words),
      currentIndex: 0,
      score: 0,
      status: 'playing',
      playedWords: [],
    });
  },

  markCorrect: () => {
    const { currentIndex, words, score, playedWords } = get();
    const nextIndex = currentIndex + 1;
    const updated = [...playedWords, { word: words[currentIndex], status: 'correct' as const }];
    if (nextIndex >= words.length) {
      set({ score: score + 1, currentIndex: nextIndex, status: 'finished', playedWords: updated });
    } else {
      set({ score: score + 1, currentIndex: nextIndex, playedWords: updated });
    }
  },

  markSkipped: () => {
    const { currentIndex, words, playedWords } = get();
    const nextIndex = currentIndex + 1;
    const updated = [...playedWords, { word: words[currentIndex], status: 'skipped' as const }];
    if (nextIndex >= words.length) {
      set({ currentIndex: nextIndex, status: 'finished', playedWords: updated });
    } else {
      set({ currentIndex: nextIndex, playedWords: updated });
    }
  },

  endRound: () => set({ status: 'finished' }),

  resetRound: () =>
    set({
      words: [],
      currentIndex: 0,
      score: 0,
      status: 'idle',
      playedWords: [],
    }),
}));
