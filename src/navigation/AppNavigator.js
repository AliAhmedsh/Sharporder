import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import {
  SplashScreen,
  OnboardingScreen,
  LoginScreen,
  SignUpScreen,
  DashboardScreen,
  DeliveryDetailsScreen,
  TripDetailsScreen,
  DriverSearchScreen,
  DriverFoundScreen,
  DeliveryCompleteScreen,
} from '../screens';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen
          name="DeliveryDetails"
          component={DeliveryDetailsScreen}
        />
        <Stack.Screen name="TripDetails" component={TripDetailsScreen} />
        <Stack.Screen name="DriverSearch" component={DriverSearchScreen} />
        <Stack.Screen name="DriverFound" component={DriverFoundScreen} />
        <Stack.Screen
          name="DeliveryComplete"
          component={DeliveryCompleteScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
