import 'react-native-gesture-handler/jestSetup';

// Mock react-native-gesture-handler for Jest environment
jest.mock('react-native-gesture-handler', () => {
  const Actual = jest.requireActual('react-native-gesture-handler');
  return {
    ...Actual,
    GestureHandlerRootView: ({ children }) => children,
  };
});

// Mock AsyncStorage native module for Jest
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Basic mocks for other common native dependencies
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const SafeAreaContext = React.createContext({
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  });

  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => React.useContext(SafeAreaContext),
  };
});

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});
