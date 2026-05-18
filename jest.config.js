module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!(' +
      '(jest-)?react-native|' +
      '@react-native(-community)?|' +
      'expo(nent)?|' +
      '@expo(nent)?/.*|' +
      'expo-router|' +
      'expo-sensors|' +
      'expo-screen-orientation|' +
      'react-navigation|' +
      '@react-navigation/.*|' +
      'zustand' +
    '))',
  ],
};
