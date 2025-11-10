import React, { useRef } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigation';

export default function App() {
  const navigationRef = useRef(null);

  return (
    <PaperProvider>
      <AppNavigator />
    </PaperProvider>
  );
}
