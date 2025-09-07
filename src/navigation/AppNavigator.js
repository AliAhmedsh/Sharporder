import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import {
  SplashScreen,
  OnboardingScreen,
  LoginScreen,
  SignUpScreen,
  RoleSelectionScreen,
  DashboardScreen,
  DeliveryDetailsScreen,
  TripDetailsScreen,
  DriverSearchScreen,
  DriverFoundScreen,
  DeliveryCompleteScreen,
  LoadBoardScreen,
  MyShipmentsScreen,
  DriverSignupScreen,
  DriverDashboardScreen,
  DriverLoadBoardScreen,
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
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
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
        <Stack.Screen name="DeliveryComplete" component={DeliveryCompleteScreen} />
        <Stack.Screen name="LoadBoard" component={LoadBoardScreen} />
        <Stack.Screen name="MyShipments" component={MyShipmentsScreen} />
        <Stack.Screen name="DriverSignup" component={DriverSignupScreen} />
        <Stack.Screen name="DriverDashboard" component={DriverDashboardScreen} />
        <Stack.Screen name="DriverLoadBoard" component={DriverLoadBoardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
