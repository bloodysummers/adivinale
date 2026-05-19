import { useGameStore } from '../../store/gameStore';
import type { Category, Word } from '../../types';

const mockCategory: Category = {
  id: 'cat-1',
  name: 'Películas',
  emoji: '🎬',
  language: 'es',
};

const mockWords: Word[] = [
  { id: 'w1', categoryId: 'cat-1', text: 'El Padrino', language: 'es' },
  { id: 'w2', categoryId: 'cat-1', text: 'Titanic', language: 'es' },
  { id: 'w3', categoryId: 'cat-1', text: 'Matrix', language: 'es' },
];

function getStore() {
  return useGameStore.getState();
}

beforeEach(() => {
  useGameStore.getState().resetRound();
});

describe('gameStore — startRound', () => {
  it('establece status a playing', () => {
    getStore().startRound(mockCategory, mockWords);
    expect(getStore().status).toBe('playing');
  });

  it('inicializa score en 0', () => {
    getStore().startRound(mockCategory, mockWords);
    expect(getStore().score).toBe(0);
  });

  it('inicializa currentIndex en 0', () => {
    getStore().startRound(mockCategory, mockWords);
    expect(getStore().currentIndex).toBe(0);
  });

  it('carga las palabras (shuffleadas pero misma cantidad)', () => {
    getStore().startRound(mockCategory, mockWords);
    expect(getStore().words).toHaveLength(mockWords.length);
  });

  it('guarda la categoría correcta', () => {
    getStore().startRound(mockCategory, mockWords);
    expect(getStore().category?.id).toBe('cat-1');
  });
});

describe('gameStore — markCorrect', () => {
  beforeEach(() => {
    getStore().startRound(mockCategory, mockWords);
  });

  it('incrementa el score en 1', () => {
    getStore().markCorrect();
    expect(getStore().score).toBe(1);
  });

  it('avanza currentIndex', () => {
    getStore().markCorrect();
    expect(getStore().currentIndex).toBe(1);
  });

  it('registra la palabra en playedWords con status correct', () => {
    getStore().markCorrect();
    expect(getStore().playedWords[0].status).toBe('correct');
  });

  it('marca status finished al acertar la última palabra', () => {
    // Avanza hasta la última
    getStore().markCorrect();
    getStore().markCorrect();
    getStore().markCorrect();
    expect(getStore().status).toBe('finished');
  });
});

describe('gameStore — markSkipped', () => {
  beforeEach(() => {
    getStore().startRound(mockCategory, mockWords);
  });

  it('no incrementa el score', () => {
    getStore().markSkipped();
    expect(getStore().score).toBe(0);
  });

  it('avanza currentIndex', () => {
    getStore().markSkipped();
    expect(getStore().currentIndex).toBe(1);
  });

  it('registra la palabra en playedWords con status skipped', () => {
    getStore().markSkipped();
    expect(getStore().playedWords[0].status).toBe('skipped');
  });

  it('marca status finished al pasar la última palabra', () => {
    getStore().markSkipped();
    getStore().markSkipped();
    getStore().markSkipped();
    expect(getStore().status).toBe('finished');
  });
});

describe('gameStore — endRound', () => {
  it('establece status a finished', () => {
    getStore().startRound(mockCategory, mockWords);
    getStore().endRound();
    expect(getStore().status).toBe('finished');
  });
});

describe('gameStore — resetRound', () => {
  it('limpia el score', () => {
    getStore().startRound(mockCategory, mockWords);
    getStore().markCorrect();
    getStore().resetRound();
    expect(getStore().score).toBe(0);
  });

  it('limpia currentIndex', () => {
    getStore().startRound(mockCategory, mockWords);
    getStore().markCorrect();
    getStore().resetRound();
    expect(getStore().currentIndex).toBe(0);
  });

  it('establece status a idle', () => {
    getStore().startRound(mockCategory, mockWords);
    getStore().resetRound();
    expect(getStore().status).toBe('idle');
  });

  it('vacía el array de words', () => {
    getStore().startRound(mockCategory, mockWords);
    getStore().resetRound();
    expect(getStore().words).toHaveLength(0);
  });

  it('vacía playedWords', () => {
    getStore().startRound(mockCategory, mockWords);
    getStore().markCorrect();
    getStore().resetRound();
    expect(getStore().playedWords).toHaveLength(0);
  });
});
