import { renderHook } from '@testing-library/react-native';
import { useAccelerometer } from '../useAccelerometer';

type AccelData = { x: number; y: number; z: number };
type AccelListener = (data: AccelData) => void;

let capturedListener: AccelListener | null = null;

jest.mock('expo-sensors', () => ({
  Accelerometer: {
    setUpdateInterval: jest.fn(),
    addListener: jest.fn((cb: AccelListener) => {
      capturedListener = cb;
      return { remove: jest.fn() };
    }),
  },
}));

describe('useAccelerometer', () => {
  let mockNow: number;

  beforeEach(() => {
    mockNow = 1000;
    capturedListener = null;
    jest.spyOn(Date, 'now').mockImplementation(() => mockNow);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function send(z: number) {
    capturedListener?.({ x: 0, y: 0, z });
  }

  it('fires onTilt("up") when z > 0.7 held for 150 ms', () => {
    const onTilt = jest.fn();
    renderHook(() => useAccelerometer({ onTilt, enabled: true }));

    // First reading: starts hold
    send(0.8);
    // Second reading 150 ms later: hold satisfied + debounce clear
    mockNow += 150;
    send(0.8);

    expect(onTilt).toHaveBeenCalledTimes(1);
    expect(onTilt).toHaveBeenCalledWith('up');
  });

  it('fires onTilt("down") when z < -0.7 held for 150 ms', () => {
    const onTilt = jest.fn();
    renderHook(() => useAccelerometer({ onTilt, enabled: true }));

    send(-0.8);
    mockNow += 150;
    send(-0.8);

    expect(onTilt).toHaveBeenCalledTimes(1);
    expect(onTilt).toHaveBeenCalledWith('down');
  });

  it('does not fire when hold is shorter than 150 ms', () => {
    const onTilt = jest.fn();
    renderHook(() => useAccelerometer({ onTilt, enabled: true }));

    send(0.8);
    mockNow += 100; // only 100 ms — not enough
    send(0.8);

    expect(onTilt).not.toHaveBeenCalled();
  });

  it('debounce: does not fire again within 600 ms of last tilt', () => {
    const onTilt = jest.fn();
    renderHook(() => useAccelerometer({ onTilt, enabled: true }));

    // First tilt
    send(0.8);
    mockNow += 150;
    send(0.8);
    expect(onTilt).toHaveBeenCalledTimes(1);

    // Try a second tilt 300 ms after the first (within debounce window)
    mockNow += 300;
    send(0.8);
    mockNow += 150;
    send(0.8);

    expect(onTilt).toHaveBeenCalledTimes(1); // still only 1
  });

  it('fires again after debounce window has passed', () => {
    const onTilt = jest.fn();
    renderHook(() => useAccelerometer({ onTilt, enabled: true }));

    // First tilt
    send(0.8);
    mockNow += 150;
    send(0.8);

    // Second tilt after 600 ms
    mockNow += 600;
    send(0.8);
    mockNow += 150;
    send(0.8);

    expect(onTilt).toHaveBeenCalledTimes(2);
  });

  it('does not fire when enabled is false', () => {
    const onTilt = jest.fn();
    renderHook(() => useAccelerometer({ onTilt, enabled: false }));

    // capturedListener is null because addListener was not called
    send(0.8);
    mockNow += 150;
    send(0.8);

    expect(onTilt).not.toHaveBeenCalled();
  });
});
