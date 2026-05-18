import { Audio } from 'expo-av';

const sounds = {
  counter: require('../../assets/audio/Counter.m4a'),
  success: require('../../assets/audio/Success.m4a'),
  skip: require('../../assets/audio/Skip.m4a'),
  gameOver: require('../../assets/audio/Game_over.m4a'),
} as const;

async function play(source: (typeof sounds)[keyof typeof sounds]) {
  try {
    const { sound } = await Audio.Sound.createAsync(source);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch {
    // Audio failures are non-critical
  }
}

export const playCounter = () => play(sounds.counter);
export const playSuccess = () => play(sounds.success);
export const playSkip = () => play(sounds.skip);
export const playGameOver = () => play(sounds.gameOver);
