import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';

import Login from '../screens/Login/Login';
import SignUp from '../screens/Register/SignUp/SignUp';
import SignUpOTP from '../screens/Register/SignUpOTP/SignUpOTP';
import Profile from '../screens/Profile/Profile';
import Search from '../screens/Search/Search';

import { theme } from '../screens/Profile/styles';
import Labs from '../screens/Labs/Labscreen/Labs';
import Home from './../screens/Home/Home';
import Medicines from './../screens/Medicines/Medicines';
import LabsDetails from './../screens/Labs/LabDetails/LabDetails';
import Address from './../screens/Labs/Address/Address';
import ForgetPassword from './../screens/ForgotPassword/ForgetPasswrd';
import Payments from './../screens/Payment/Payment';
import Orders from '../screens/Orders/OrderHistory/Orders';
import UserDetails from './../screens/Labs/UserDetails/UserDetails';

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
          <Stack.Screen name="ForgotPassword" component={ForgetPassword} />

          {/* App screens */}
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Labs" component={Labs} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Medicines" component={Medicines} />
          <Stack.Screen name="UserDetails" component={UserDetails} />
          <Stack.Screen
            name="LabDetails"
            component={LabsDetails}
            options={{
              animation: 'flip',
            }}
          />
          <Stack.Screen name="Address" component={Address} />
          <Stack.Screen name="Payment" component={Payments} />
          <Stack.Screen name="Order" component={Orders} />

          {/* Modal screen */}

          <Stack.Screen
            name="Search"
            component={Search}
            options={{
              presentation: 'transparentModal',
              animation: 'slide_from_bottom',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
