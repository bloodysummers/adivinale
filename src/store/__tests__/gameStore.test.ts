import { useGameStore } from '../gameStore';
import type { Category, Word } from '../../types';

const mockCategory: Category = {
  id: 'test',
  name: 'Test',
  emoji: '🎮',
  language: 'es',
};

const mockWords: Word[] = [
  { id: 'w1', categoryId: 'test', text: 'Uno', language: 'es' },
  { id: 'w2', categoryId: 'test', text: 'Dos', language: 'es' },
  { id: 'w3', categoryId: 'test', text: 'Tres', language: 'es' },
];

beforeEach(() => {
  useGameStore.setState({
    category: null,
    words: [],
    currentIndex: 0,
    score: 0,
    status: 'idle',
  });
});

describe('startRound', () => {
  it('sets category, shuffles words, resets index/score, status = playing', () => {
    useGameStore.getState().startRound(mockCategory, mockWords);
    const s = useGameStore.getState();
    expect(s.category).toEqual(mockCategory);
    expect(s.words).toHaveLength(mockWords.length);
    expect(s.words).toEqual(expect.arrayContaining(mockWords));
    expect(s.currentIndex).toBe(0);
    expect(s.score).toBe(0);
    expect(s.status).toBe('playing');
  });
});

describe('markCorrect', () => {
  it('increments score and advances index', () => {
    useGameStore.getState().startRound(mockCategory, mockWords);
    useGameStore.getState().markCorrect();
    const s = useGameStore.getState();
    expect(s.score).toBe(1);
    expect(s.currentIndex).toBe(1);
    expect(s.status).toBe('playing');
  });

  it('sets status to finished when on the last word', () => {
    useGameStore.getState().startRound(mockCategory, mockWords);
    // advance to last word
    useGameStore.setState({ currentIndex: mockWords.length - 1 });
    useGameStore.getState().markCorrect();
    expect(useGameStore.getState().status).toBe('finished');
  });
});

describe('markSkipped', () => {
  it('does not change score but advances index', () => {
    useGameStore.getState().startRound(mockCategory, mockWords);
    useGameStore.getState().markSkipped();
    const s = useGameStore.getState();
    expect(s.score).toBe(0);
    expect(s.currentIndex).toBe(1);
    expect(s.status).toBe('playing');
  });

  it('sets status to finished when on the last word', () => {
    useGameStore.getState().startRound(mockCategory, mockWords);
    useGameStore.setState({ currentIndex: mockWords.length - 1 });
    useGameStore.getState().markSkipped();
    expect(useGameStore.getState().status).toBe('finished');
  });
});

describe('endRound', () => {
  it('sets status to finished', () => {
    useGameStore.getState().startRound(mockCategory, mockWords);
    useGameStore.getState().endRound();
    expect(useGameStore.getState().status).toBe('finished');
  });
});

describe('resetRound', () => {
  it('clears words, index, score and sets status to idle', () => {
    useGameStore.getState().startRound(mockCategory, mockWords);
    useGameStore.getState().markCorrect();
    useGameStore.getState().resetRound();
    const s = useGameStore.getState();
    expect(s.words).toEqual([]);
    expect(s.currentIndex).toBe(0);
    expect(s.score).toBe(0);
    expect(s.status).toBe('idle');
  });
});
