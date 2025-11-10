// AppNavigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Provider as PaperProvider } from 'react-native-paper'; // ✅ correct import

import Login from '../screens/Login/Login';
import SignUp from '../screens/Register/SignUp/SignUp';
import SignUpOTP from '../screens/Register/SignUpOTP/SignUpOTP';
import Profile from '../screens/Profile/Profile';
import Search from '../screens/Search/Search';

import { theme } from '../screens/Profile/styles'; // ✅ named import

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          {/* Auth flow */}
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="SignUpOTP" component={SignUpOTP} />
          {/* App screens */}
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Search" component={Search} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
