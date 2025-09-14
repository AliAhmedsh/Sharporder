import React from 'react';
import { AppProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import { LogBox } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';

LogBox.ignoreAllLogs();

const App = () => {
  return ( 
    <AuthProvider>
      <AppProvider>
        <AppNavigator />
      </AppProvider>
    </AuthProvider>
  );
};

export default App;
