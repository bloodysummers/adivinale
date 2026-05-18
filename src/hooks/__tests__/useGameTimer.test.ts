import { renderHook, act } from '@testing-library/react-native';
import { useGameTimer } from '../useGameTimer';

describe('useGameTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('starts with timeLeft equal to duration', () => {
    const { result } = renderHook(() =>
      useGameTimer({ duration: 5, running: true, onExpire: jest.fn() })
    );
    expect(result.current.timeLeft).toBe(5);
  });

  it('decrements by 1 each second when running', () => {
    const { result } = renderHook(() =>
      useGameTimer({ duration: 5, running: true, onExpire: jest.fn() })
    );
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(result.current.timeLeft).toBe(3);
  });

  it('calls onExpire exactly once when timeLeft reaches 0', () => {
    const onExpire = jest.fn();
    renderHook(() =>
      useGameTimer({ duration: 3, running: true, onExpire })
    );
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('does not decrement when running is false', () => {
    const { result } = renderHook(() =>
      useGameTimer({ duration: 5, running: false, onExpire: jest.fn() })
    );
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(result.current.timeLeft).toBe(5);
  });

  it('does not call onExpire when not running', () => {
    const onExpire = jest.fn();
    renderHook(() =>
      useGameTimer({ duration: 3, running: false, onExpire })
    );
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(onExpire).not.toHaveBeenCalled();
  });
});
